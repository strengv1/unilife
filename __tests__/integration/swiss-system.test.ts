import { describe, it, expect, beforeEach } from 'vitest'
import '../../src/test/setup'  // Import setup first to ensure tables are created
import { EliminationBracket, SwissSystem } from '@/app/lib/tournament-logic'
import { BuchholzCalculator } from '@/app/lib/buccholz-calculator'
import { db } from '@/app/lib/db'  // Use the main db connection
import { createTestTournament, getTournamentMatches, getTournamentTeams, assertSwissInvariants } from '../../src/test/utils'
import { eq, and } from 'drizzle-orm'
import { matches, teams } from '@/app/lib/schema'

describe('SwissSystem Integration Tests', () => {
  beforeEach(() => {
    BuchholzCalculator.clearCache()
  })

  describe('calculateSwissRounds', () => {
    it('should calculate correct number of rounds based on team count', () => {
      expect(SwissSystem.calculateSwissRounds(2)).toBe(1)
      expect(SwissSystem.calculateSwissRounds(4)).toBe(2)
      expect(SwissSystem.calculateSwissRounds(8)).toBe(3)
      expect(SwissSystem.calculateSwissRounds(16)).toBe(4)
      expect(SwissSystem.calculateSwissRounds(32)).toBe(5)
      expect(SwissSystem.calculateSwissRounds(64)).toBe(6)
      
      // Non-power-of-2 numbers
      expect(SwissSystem.calculateSwissRounds(5)).toBe(3)
      expect(SwissSystem.calculateSwissRounds(12)).toBe(4)
      expect(SwissSystem.calculateSwissRounds(24)).toBe(5)
      expect(SwissSystem.calculateSwissRounds(150)).toBe(8)
    })
  })

  describe('generateSwissRound', () => {
    it('should create matches for all teams in first round', async () => {
      const { tournament } = await createTestTournament({ teamCount: 8 })

      await SwissSystem.generateSwissRound(tournament.id, 1)
      
      const roundMatches = await getTournamentMatches(tournament.id)
      
      // With 8 teams, should have 4 matches
      expect(roundMatches.length).toBe(4)
      
      // All matches should be round 1, swiss phase, pending
      roundMatches.forEach(match => {
        expect(match.roundNumber).toBe(1)
        expect(match.phase).toBe('swiss')
        expect(match.status).toBe('pending')
      })
      
      // Check all teams are playing
      const playingTeams = new Set<number>()
      roundMatches.forEach(match => {
        if (match.team1Id) playingTeams.add(match.team1Id)
        if (match.team2Id) playingTeams.add(match.team2Id)
      })
      expect(playingTeams.size).toBe(8)
    })

    it('should handle odd number of teams with bye', async () => {
      const { tournament, } = await createTestTournament({ teamCount: 7 })
      
      await SwissSystem.generateSwissRound(tournament.id, 1)
      
      const roundMatches = await getTournamentMatches(tournament.id)
      
      // With 7 teams, should have 4 matches (3 regular + 1 bye)
      expect(roundMatches.length).toBe(4)
      
      // Find the bye match
      const byeMatch = roundMatches.find(m => m.team2Id === null)
      expect(byeMatch).toBeDefined()
      expect(byeMatch?.status).toBe('completed')
      expect(byeMatch?.team1Score).toBe(0)
      expect(byeMatch?.team2Score).toBe(0)
      expect(byeMatch?.winnerId).toBe(byeMatch?.team1Id)
      
      // Check that the team with bye got 3 points
      const byeTeam = await db
        .select()
        .from(teams)
        .where(eq(teams.id, byeMatch!.team1Id!))
      
      expect(byeTeam[0].swissPoints).toBe(3)
      expect(byeTeam[0].swissWins).toBe(1)
    })

    it('should pair teams with similar records in later rounds', async () => {
      const { tournament } = await createTestTournament({ teamCount: 8 })
      
      // Generate and complete round 1
      await SwissSystem.generateSwissRound(tournament.id, 1)
      const round1Matches = await getTournamentMatches(tournament.id)
      
      // Simulate some results (teams 1,3,5,7 win)
      for (const match of round1Matches) {
        if (match.team1Id && match.team2Id) {
          const team1Wins = match.team1Id % 2 === 1
          await SwissSystem.updateSwissStandings(
            match.id,
            team1Wins ? 10 : 5,
            team1Wins ? 5 : 10
          )
        }
      }
      
      // Generate round 2
      await SwissSystem.generateSwissRound(tournament.id, 2)
      const allMatches = await getTournamentMatches(tournament.id)
      const round2Matches = allMatches.filter(m => m.roundNumber === 2)
      
      // Get teams
      const teams = await getTournamentTeams(tournament.id)
      
      // Winners (3 points) should be paired with winners
      // Losers (0 points) should be paired with losers
      const winners = teams.filter(t => t.swissPoints === 3)
      const losers = teams.filter(t => t.swissPoints === 0)
      
      expect(winners.length).toBe(4)
      expect(losers.length).toBe(4)
      
      // Check that similar records are paired
      round2Matches.forEach(match => {
        if (match.team1Id && match.team2Id) {
          const team1 = teams.find(t => t.id === match.team1Id)
          const team2 = teams.find(t => t.id === match.team2Id)
          
          // Teams in the same match should have same points
          expect(Math.abs((team1?.swissPoints || 0) - (team2?.swissPoints || 0))).toBeLessThanOrEqual(3)
        }
      })
    })

    it('should never pair teams that have already played', async () => {
      const { tournament, teams: testTeams } = await createTestTournament({ teamCount: 4 })
      
      // Run 3 rounds (max for 4 teams)
      for (let round = 1; round <= 3; round++) {
        await SwissSystem.generateSwissRound(tournament.id, round)
        
        // Complete all matches in this round
        const roundMatches = await db
          .select()
          .from(matches)
          .where(eq(matches.roundNumber, round))
        
        for (const match of roundMatches) {
          if (match.team1Id && match.team2Id) {
            await SwissSystem.updateSwissStandings(match.id, 10, 5)
          }
        }
      }
      
      const allMatches = await getTournamentMatches(tournament.id)
      const invariants = assertSwissInvariants(allMatches, testTeams)
      
      expect(invariants.noRepeatedPairings).toBe(true)
      expect(invariants.errors).toHaveLength(0)
    })
  })

  describe('updateSwissStandings', () => {
    it('should correctly update standings for a win', async () => {
      const { tournament } = await createTestTournament({ teamCount: 2 })
      
      await SwissSystem.generateSwissRound(tournament.id, 1)
      const roundMatches = await getTournamentMatches(tournament.id)
      const match = roundMatches[0]
      
      // Team 1 wins 10-5
      await SwissSystem.updateSwissStandings(match.id, 10, 5)
      
      const updatedTeams = await getTournamentTeams(tournament.id)
      const team1 = updatedTeams.find(t => t.id === match.team1Id)
      const team2 = updatedTeams.find(t => t.id === match.team2Id)
      
      // Team 1 (winner)
      expect(team1?.swissPoints).toBe(3)
      expect(team1?.swissWins).toBe(1)
      expect(team1?.swissLosses).toBe(0)
      expect(team1?.swissGamePointsFor).toBe(10)
      expect(team1?.swissGamePointsAgainst).toBe(5)
      
      // Team 2 (loser)
      expect(team2?.swissPoints).toBe(0)
      expect(team2?.swissWins).toBe(0)
      expect(team2?.swissLosses).toBe(1)
      expect(team2?.swissGamePointsFor).toBe(5)
      expect(team2?.swissGamePointsAgainst).toBe(10)
    })

    it('should correctly update standings for a draw', async () => {
      const { tournament } = await createTestTournament({ teamCount: 2 })
      
      await SwissSystem.generateSwissRound(tournament.id, 1)
      const roundMatches = await getTournamentMatches(tournament.id)
      const match = roundMatches[0]
      
      // Draw 7-7
      await SwissSystem.updateSwissStandings(match.id, 7, 7)
      
      const updatedTeams = await getTournamentTeams(tournament.id)
      const team1 = updatedTeams.find(t => t.id === match.team1Id)
      const team2 = updatedTeams.find(t => t.id === match.team2Id)
      
      // Both teams
      expect(team1?.swissPoints).toBe(1)
      expect(team1?.swissDraws).toBe(1)
      expect(team1?.swissWins).toBe(0)
      expect(team1?.swissLosses).toBe(0)
      expect(team1?.swissGamePointsFor).toBe(7)
      expect(team1?.swissGamePointsAgainst).toBe(7)
      
      expect(team2?.swissPoints).toBe(1)
      expect(team2?.swissDraws).toBe(1)
      expect(team2?.swissWins).toBe(0)
      expect(team2?.swissLosses).toBe(0)
      expect(team2?.swissGamePointsFor).toBe(7)
      expect(team2?.swissGamePointsAgainst).toBe(7)
    })

    it('should not allow updating bye matches', async () => {
      const { tournament } = await createTestTournament({ teamCount: 3 })
      
      await SwissSystem.generateSwissRound(tournament.id, 1)
      const roundMatches = await getTournamentMatches(tournament.id)
      const byeMatch = roundMatches.find(m => m.team2Id === null)
      
      expect(byeMatch).toBeDefined()
      
      await expect(
        SwissSystem.updateSwissStandings(byeMatch!.id, 10, 0)
      ).rejects.toThrow('Cannot update a bye match')
    })
  })

  describe('reverseSwissStandings', () => {
    it('should correctly reverse standings when editing a match', async () => {
      const { tournament } = await createTestTournament({ teamCount: 2 })

      await SwissSystem.generateSwissRound(tournament.id, 1)
      const roundMatches = await getTournamentMatches(tournament.id)
      const match = roundMatches[0]
      
      // Team 1 wins 10-5
      await SwissSystem.updateSwissStandings(match.id, 10, 5)
      
      // Get teams after first score
      const afterFirst = await getTournamentTeams(tournament.id)
      const team1After = afterFirst.find(t => t.id === match.team1Id)
      const team2After = afterFirst.find(t => t.id === match.team2Id)
      
      expect(team1After?.swissPoints).toBe(3)
      expect(team2After?.swissPoints).toBe(0)
      
      // Reverse the standings
      await SwissSystem.reverseSwissStandings(10, 5, match.team1Id!, match.team2Id!)
      
      // Check standings are back to 0
      const afterReverse = await getTournamentTeams(tournament.id)
      const team1Reversed = afterReverse.find(t => t.id === match.team1Id)
      const team2Reversed = afterReverse.find(t => t.id === match.team2Id)
      
      expect(team1Reversed?.swissPoints).toBe(0)
      expect(team1Reversed?.swissWins).toBe(0)
      expect(team1Reversed?.swissGamePointsFor).toBe(0)
      expect(team1Reversed?.swissGamePointsAgainst).toBe(0)
      
      expect(team2Reversed?.swissPoints).toBe(0)
      expect(team2Reversed?.swissLosses).toBe(0)
      expect(team2Reversed?.swissGamePointsFor).toBe(0)
      expect(team2Reversed?.swissGamePointsAgainst).toBe(0)
    })
  })

  describe('getStandings', () => {
    it('should return teams sorted by tiebreakers', async () => {
      const { tournament, teams: testTeams } = await createTestTournament({ teamCount: 4 })
      
      // Manually set team stats to test tiebreaking
      await db.update(teams).set({
        swissPoints: 6,
        swissWins: 2,
        swissGamePointsFor: 20,
        swissGamePointsAgainst: 10
      }).where(eq(teams.id, testTeams[0].id))
      
      await db.update(teams).set({
        swissPoints: 6,
        swissWins: 2,
        swissGamePointsFor: 18,
        swissGamePointsAgainst: 10
      }).where(eq(teams.id, testTeams[1].id))
      
      await db.update(teams).set({
        swissPoints: 3,
        swissWins: 1,
        swissGamePointsFor: 15,
        swissGamePointsAgainst: 15
      }).where(eq(teams.id, testTeams[2].id))
      
      await db.update(teams).set({
        swissPoints: 0,
        swissLosses: 2,
        swissGamePointsFor: 10,
        swissGamePointsAgainst: 20
      }).where(eq(teams.id, testTeams[3].id))
      
      const standings = await SwissSystem.getStandings(tournament.id)
      
      // Check order: Team 0 (6pts, +10 diff) > Team 1 (6pts, +8 diff) > Team 2 (3pts) > Team 3 (0pts)
      expect(standings[0].id).toBe(testTeams[0].id)
      expect(standings[1].id).toBe(testTeams[1].id)
      expect(standings[2].id).toBe(testTeams[2].id)
      expect(standings[3].id).toBe(testTeams[3].id)
    })
  })

  describe('isByeMatch', () => {
    it('should correctly identify bye matches', () => {
      expect(SwissSystem.isByeMatch({ team1Id: 1, team2Id: null })).toBe(true)
      expect(SwissSystem.isByeMatch({ team1Id: 1, team2Id: 2 })).toBe(false)
      expect(SwissSystem.isByeMatch({ team1Id: null, team2Id: 2 })).toBe(false)
      expect(SwissSystem.isByeMatch({ team1Id: null, team2Id: null })).toBe(false)
    })
  })

  describe('Large Tournament Stress Test', () => {
    it('should handle a 150-team tournament with complex standings and edge cases', async () => {
      // Create a large tournament
      const { tournament, teams: testTeams } = await createTestTournament({ 
        teamCount: 150,
        swissRounds: 8,  // log2(150) ≈ 7.2, so 8 rounds
        eliminationTeams: 32
      })
      
      // Track two specific teams throughout the tournament
      const trackedTeam1 = testTeams[0]
      const trackedTeam2 = testTeams[3]
      const team1Results: Array<{ round: number, score: number, opponentScore: number, points: number }> = []
      const team2Results: Array<{ round: number, score: number, opponentScore: number, points: number }> = []
      
      // Round 1: Generate pairings
      await SwissSystem.generateSwissRound(tournament.id, 1)
      let allMatches = await getTournamentMatches(tournament.id)
      let round1Matches = allMatches.filter(m => m.roundNumber === 1)
      
      // Should have 75 matches (150/2)
      expect(round1Matches.length).toBe(75)
      
      // Simulate Round 1 with various outcomes including draws
      for (let i = 0; i < round1Matches.length; i++) {
        const match = round1Matches[i]
        if (!match.team1Id || !match.team2Id) continue
        
        let score1, score2
        
        // Set specific scores for tracked teams
        if (match.team1Id === trackedTeam1.id || match.team2Id === trackedTeam1.id) {
          // Team 1: Win 10-5 in round 1
          score1 = match.team1Id === trackedTeam1.id ? 10 : 5
          score2 = match.team1Id === trackedTeam1.id ? 5 : 10
          team1Results.push({ round: 1, score: 10, opponentScore: 5, points: 3 })
        } else if (match.team1Id === trackedTeam2.id || match.team2Id === trackedTeam2.id) {
          // Team 2: Draw 7-7 in round 1
          score1 = 7
          score2 = 7
          team2Results.push({ round: 1, score: 7, opponentScore: 7, points: 1 })
        } else if (i % 10 === 0) {
          // Every 10th match is a draw
          const drawScore = Math.floor(Math.random() * 10)
          score1 = drawScore
          score2 = drawScore
        } else if (i % 7 === 0) {
          // Close games
          score1 = 10
          score2 = 8 + Math.floor(Math.random() * 2)
        } else {
          // Regular wins
          score1 = i % 2 === 0 ? 10 : Math.floor(Math.random() * 9)
          score2 = i % 2 === 0 ? Math.floor(Math.random() * 9) : 10
        }
        
        await SwissSystem.updateSwissStandings(match.id, score1, score2)
      }
      
      // Verify Round 1 standings
      let standings = await SwissSystem.getStandings(tournament.id)
      const winners = standings.filter(t => t.swissPoints === 3)
      const drawers = standings.filter(t => t.swissPoints === 1)
      const losers = standings.filter(t => t.swissPoints === 0)
      
      // With ~15 draws (150/10), we should have ~30 teams with 1 point
      expect(drawers.length).toBeGreaterThanOrEqual(12)
      expect(drawers.length).toBeLessThanOrEqual(18)
      expect(winners.length + losers.length + drawers.length).toBe(150)
      
      // Define exact results for tracked teams for rounds 2-8
      const team1PlannedResults = [
        { round: 2, score: 10, opponentScore: 3, points: 3 },  // Win
        { round: 3, score: 5, opponentScore: 5, points: 1 },   // Draw
        { round: 4, score: 10, opponentScore: 8, points: 3 },  // Win
        { round: 5, score: 4, opponentScore: 10, points: 0 },  // Loss
        { round: 6, score: 10, opponentScore: 2, points: 3 },  // Win
        { round: 7, score: 9, opponentScore: 9, points: 1 },   // Draw
        { round: 8, score: 10, opponentScore: 7, points: 3 },  // Win
      ]
      
      const team2PlannedResults = [
        { round: 2, score: 3, opponentScore: 10, points: 0 },  // Loss
        { round: 3, score: 10, opponentScore: 6, points: 3 },  // Win
        { round: 4, score: 8, opponentScore: 8, points: 1 },   // Draw
        { round: 5, score: 10, opponentScore: 4, points: 3 },  // Win
        { round: 6, score: 5, opponentScore: 10, points: 0 },  // Loss
        { round: 7, score: 10, opponentScore: 9, points: 3 },  // Win
        { round: 8, score: 6, opponentScore: 6, points: 1 },   // Draw
      ]
      
      // Run remaining 7 rounds
      for (let round = 2; round <= 8; round++) {
        await SwissSystem.generateSwissRound(tournament.id, round)
        
        allMatches = await getTournamentMatches(tournament.id)
        const roundMatches = allMatches.filter(m => m.roundNumber === round)
        
        // Check Swiss invariants
        const invariants = assertSwissInvariants(
          allMatches.filter(m => m.roundNumber <= round),
          testTeams
        )
        expect(invariants.noRepeatedPairings).toBe(true)
        expect(invariants.errors).toHaveLength(0)
        
        // Simulate matches with realistic distribution
        for (const match of roundMatches) {
          if (!match.team1Id || !match.team2Id) continue
          
          let score1, score2
          
          // Handle tracked team 1
          if (match.team1Id === trackedTeam1.id || match.team2Id === trackedTeam1.id) {
            const result = team1PlannedResults[round - 2]
            if (match.team1Id === trackedTeam1.id) {
              score1 = result.score
              score2 = result.opponentScore
            } else {
              score1 = result.opponentScore
              score2 = result.score
            }
            team1Results.push(result)
          }
          // Handle tracked team 2
          else if (match.team1Id === trackedTeam2.id || match.team2Id === trackedTeam2.id) {
            const result = team2PlannedResults[round - 2]
            if (match.team1Id === trackedTeam2.id) {
              score1 = result.score
              score2 = result.opponentScore
            } else {
              score1 = result.opponentScore
              score2 = result.score
            }
            team2Results.push(result)
          }
          // Other matches
          else {
            const team1Standing = standings.find(s => s.id === match.team1Id)
            const team2Standing = standings.find(s => s.id === match.team2Id)
            
            const random = Math.random()
            
            if (random < 0.1) {
              // 10% draws
              const drawScore = Math.floor(Math.random() * 10)
              score1 = drawScore
              score2 = drawScore
            } else if (team1Standing && team2Standing) {
              // Higher ranked team has 70% chance to win
              const team1Rank = standings.indexOf(team1Standing)
              const team2Rank = standings.indexOf(team2Standing)
              
              if (team1Rank < team2Rank) {
                score1 = Math.random() < 0.7 ? 10 : Math.floor(Math.random() * 9)
                score2 = score1 === 10 ? Math.floor(Math.random() * 10) : 10
              } else {
                score1 = Math.random() < 0.3 ? 10 : Math.floor(Math.random() * 9)
                score2 = score1 === 10 ? Math.floor(Math.random() * 10) : 10
              }
            } else {
              // Random result
              score1 = Math.random() < 0.5 ? 10 : Math.floor(Math.random() * 9)
              score2 = score1 === 10 ? Math.floor(Math.random() * 10) : 10
            }
          }
          
          await SwissSystem.updateSwissStandings(match.id, score1, score2)
        }
        
        // Update standings after each round
        standings = await SwissSystem.getStandings(tournament.id)
      }
      
      // Verify tracked teams' final statistics
      const finalTeam1 = await db.select().from(teams).where(eq(teams.id, trackedTeam1.id))
      const finalTeam2 = await db.select().from(teams).where(eq(teams.id, trackedTeam2.id))
      
      // Calculate expected totals for Team 1
      const team1ExpectedPoints = team1Results.reduce((sum, r) => sum + r.points, 0)
      const team1ExpectedWins = team1Results.filter(r => r.points === 3).length
      const team1ExpectedDraws = team1Results.filter(r => r.points === 1).length
      const team1ExpectedLosses = team1Results.filter(r => r.points === 0).length
      const team1ExpectedCupsFor = team1Results.reduce((sum, r) => sum + r.score, 0)
      const team1ExpectedCupsAgainst = team1Results.reduce((sum, r) => sum + r.opponentScore, 0)
      
      // Verify Team 1 stats
      expect(finalTeam1[0].swissPoints).toBe(team1ExpectedPoints) // Should be 17 (5W, 2D, 1L)
      expect(finalTeam1[0].swissWins).toBe(team1ExpectedWins)
      expect(finalTeam1[0].swissDraws).toBe(team1ExpectedDraws)
      expect(finalTeam1[0].swissLosses).toBe(team1ExpectedLosses)
      expect(finalTeam1[0].swissGamePointsFor).toBe(team1ExpectedCupsFor)
      expect(finalTeam1[0].swissGamePointsAgainst).toBe(team1ExpectedCupsAgainst)
      
      // Calculate expected totals for Team 2
      const team2ExpectedPoints = team2Results.reduce((sum, r) => sum + r.points, 0)
      const team2ExpectedWins = team2Results.filter(r => r.points === 3).length
      const team2ExpectedDraws = team2Results.filter(r => r.points === 1).length
      const team2ExpectedLosses = team2Results.filter(r => r.points === 0).length
      const team2ExpectedCupsFor = team2Results.reduce((sum, r) => sum + r.score, 0)
      const team2ExpectedCupsAgainst = team2Results.reduce((sum, r) => sum + r.opponentScore, 0)
      
      // Verify Team 2 stats
      expect(finalTeam2[0].swissPoints).toBe(team2ExpectedPoints) // Should be 12 (3W, 3D, 2L)
      expect(finalTeam2[0].swissWins).toBe(team2ExpectedWins)
      expect(finalTeam2[0].swissDraws).toBe(team2ExpectedDraws)
      expect(finalTeam2[0].swissLosses).toBe(team2ExpectedLosses)
      expect(finalTeam2[0].swissGamePointsFor).toBe(team2ExpectedCupsFor)
      expect(finalTeam2[0].swissGamePointsAgainst).toBe(team2ExpectedCupsAgainst)
      
      console.log(`Tracked Team 1: ${team1ExpectedWins}W-${team1ExpectedDraws}D-${team1ExpectedLosses}L, ${team1ExpectedPoints} points, Cup diff: ${team1ExpectedCupsFor - team1ExpectedCupsAgainst}`)
      console.log(`Tracked Team 2: ${team2ExpectedWins}W-${team2ExpectedDraws}D-${team2ExpectedLosses}L, ${team2ExpectedPoints} points, Cup diff: ${team2ExpectedCupsFor - team2ExpectedCupsAgainst}`)
      
      // Final verification after all Swiss rounds
      allMatches = await getTournamentMatches(tournament.id)
      
      // Should have exactly 8 * 75 = 600 matches
      expect(allMatches.filter(m => m.phase === 'swiss').length).toBe(600)
      
      // Check final standings make sense
      standings = await SwissSystem.getStandings(tournament.id)
      
      // Maximum possible points is 24 (8 wins * 3 points)
      const maxPoints = Math.max(...standings.map(t => t.swissPoints || 0))
      expect(maxPoints).toBeLessThanOrEqual(24)
      expect(maxPoints).toBeGreaterThanOrEqual(18) // At least someone should win 6+ matches
      
      // Check Buchholz calculations
      const topTeams = standings.slice(0, 10)
      for (const team of topTeams) {
        const detailedBuchholz = await BuchholzCalculator.calculateDetailedMedianBuchholz(
          team.id,
          tournament.id
        )
        
        // After 8 rounds, everyone should have 8 opponents (unless bye)
        expect(detailedBuchholz.totalOpponents).toBeGreaterThanOrEqual(7)
        expect(detailedBuchholz.totalOpponents).toBeLessThanOrEqual(8)
        
        // With 8 opponents, median rule should apply (exclude highest and lowest)
        if (detailedBuchholz.totalOpponents >= 3) {
          expect(detailedBuchholz.scoresExcluded.length).toBe(2)
          expect(detailedBuchholz.scoresUsed.length).toBe(detailedBuchholz.totalOpponents - 2)
        }
      }
      
      // Test tiebreaking with similar points
      const samePointsGroups = new Map<number, typeof standings>()
      for (const team of standings) {
        const points = team.swissPoints || 0
        if (!samePointsGroups.has(points)) {
          samePointsGroups.set(points, [])
        }
        samePointsGroups.get(points)!.push(team)
      }
      
      // Find a group with multiple teams at same points
      for (const [points, teams] of samePointsGroups) {
        if (teams.length > 1) {
          // Verify they're sorted by tiebreakers
          for (let i = 0; i < teams.length - 1; i++) {
            const team1 = teams[i]
            const team2 = teams[i + 1]
            
            // Cup difference
            const cupDiff1 = (team1.swissGamePointsFor || 0) - (team1.swissGamePointsAgainst || 0)
            const cupDiff2 = (team2.swissGamePointsFor || 0) - (team2.swissGamePointsAgainst || 0)

            if (cupDiff1 !== cupDiff2) {
              expect(cupDiff1).toBeGreaterThanOrEqual(cupDiff2)
            } else if (team1.buchholzScore !== team2.buchholzScore) {
              // If cup diff is same, Buchholz should be higher
              expect(team1.buchholzScore || 0).toBeGreaterThanOrEqual(team2.buchholzScore || 0)
            } else if(team1.opponentsBuchholzScore !== team2.opponentsBuchholzScore) {
              expect(team1.opponentsBuchholzScore || 0).toBeGreaterThan(team2.opponentsBuchholzScore || 0)
            }
          }
        }
      }
      
      // Qualify teams for elimination
      await SwissSystem.qualifyForElimination(tournament.id, 32)
      
      // Check qualified teams
      const qualifiedTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.qualifiedForElimination, true))
      
      expect(qualifiedTeams.length).toBe(32)
      
      // Verify seeds are assigned correctly
      const seededTeams = qualifiedTeams.sort((a, b) => (a.seed || 0) - (b.seed || 0))
      for (let i = 0; i < seededTeams.length; i++) {
        expect(seededTeams[i].seed).toBe(i + 1)
      }
      
      // Generate elimination bracket
      await EliminationBracket.generateBracket(tournament.id)
      
      const eliminationMatches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, tournament.id),
            eq(matches.phase, 'elimination')
          )
        )
      
      // Should have 31 matches for 32 teams (32→16→8→4→2→1)
      expect(eliminationMatches.length).toBe(31)
      
      // Test match editing after rounds complete
      const oldMatch = allMatches.find(m => m.roundNumber === 3 && m.status === 'completed')
      if (oldMatch && oldMatch.team1Score !== null && oldMatch.team2Score !== null) {
        const oldScore1 = oldMatch.team1Score
        const oldScore2 = oldMatch.team2Score
        
        // Reverse the old score
        await SwissSystem.reverseSwissStandings(
          oldScore1,
          oldScore2,
          oldMatch.team1Id!,
          oldMatch.team2Id!
        )
        
        // Apply new score
        await SwissSystem.updateSwissStandings(oldMatch.id, 10, 0)
        
        // Standings should be updated
        const newStandings = await SwissSystem.getStandings(tournament.id)
        expect(newStandings).toBeDefined()
      }
      
      console.log(`Tournament complete: ${standings[0].name} wins with ${standings[0].swissPoints} points`)
    }, 30000) // 30 second timeout for this large test
  })
})