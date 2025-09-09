import { describe, it, expect, beforeEach, vi } from 'vitest'
import '../../src/test/setup'
import { getTeamDetailsAction } from '@/lib/actions/team-actions'
import { 
  createTournamentAction, 
  startTournamentAction 
} from '@/lib/actions/tournament-actions'
import { updateMatchScoreAction } from '@/lib/actions/match-actions'
import { db } from '@/lib/db'
import { teams, matches } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'


vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn().mockResolvedValue(true),
  checkPassword: vi.fn().mockReturnValue(true),
  createToken: vi.fn().mockReturnValue('test-token'),
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn()
}))
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('Team Actions Integration Tests', () => {
  let tournamentSlug: string
  let tournamentId: number
  let testTeams: any[]

  beforeEach(async () => {
    // Create and start a tournament
    const formData = new FormData()
    formData.set('name', 'Team Details Test')
    formData.set('slug', `team-test-${Date.now()}`)
    formData.set('type', 'swiss_elimination')
    formData.set('swissRounds', '3')
    formData.set('eliminationTeams', '4')
    formData.set('teams', 'Alpha\nBeta\nGamma\nDelta\nEpsilon\nZeta\nEta\nTheta')
    
    const result = await createTournamentAction(formData)

    tournamentSlug = result.tournament!.slug
    tournamentId = result.tournament!.id
    
    // Get teams
    testTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournamentId))
    
    // Start tournament
    await startTournamentAction(tournamentSlug)
  })

  describe('getTeamDetailsAction', () => {
    it('should get team details with basic info', async () => {
      const team = testTeams[0]
      
      const result = await getTeamDetailsAction(tournamentSlug, team.id)

      expect(result.team).toBeDefined()
      expect(result.team!.id).toBe(team.id)
      expect(result.team!.name).toBe(team.name)
      expect(result.team!.tournament.slug).toBe(tournamentSlug)
      expect(result.team!.rank).toBeDefined()
    })

    it('should include match history', async () => {
      const team = testTeams[0]
      
      // Get and complete a match for this team
      const teamMatches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, tournamentId),
            eq(matches.team1Id, team.id)
          )
        )
      
      if (teamMatches.length > 0) {
        const match = teamMatches[0]
        await updateMatchScoreAction(tournamentSlug, match.id, 10, 5)
      }
      
      const result = await getTeamDetailsAction(tournamentSlug, team.id)
      
      expect(result.team!.pastMatches).toBeDefined()
      expect(result.team!.pastMatches.length).toBeGreaterThan(0)
      
      const pastMatch = result.team!.pastMatches[0]
      expect(pastMatch.team1Score).toBe(10)
      expect(pastMatch.team2Score).toBe(5)
      expect(pastMatch.winnerId).toBe(team.id)
      expect(pastMatch.opponent).toBeDefined()
    })

    it('should show next match information', async () => {
      const team = testTeams[0]
      
      const result = await getTeamDetailsAction(tournamentSlug, team.id)
      
      expect(result.team!.nextMatch).toBeDefined()
      expect(result.team!.nextMatch!.roundNumber).toBe(1)
      expect(result.team!.nextMatch!.phase).toBe('swiss')
      expect(result.team!.nextMatch!.opponent).toBeDefined()
      expect(result.team!.nextMatch!.tableNumber).toBeDefined()
      expect(result.team!.nextMatch!.tableNumber).toBeGreaterThanOrEqual(1)
      expect(result.team!.nextMatch!.tableNumber).toBeLessThanOrEqual(38)
      expect(result.team!.nextMatch!.turnNumber).toBeDefined()
      expect(result.team!.nextMatch!.turnNumber).toBeGreaterThanOrEqual(1)
      expect(result.team!.nextMatch!.turnNumber).toBeLessThanOrEqual(3)
    })

    it('should calculate Buchholz details', async () => {
      const team = testTeams[0]
      
      // Complete round 1 matches
      const round1Matches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, tournamentId),
            eq(matches.roundNumber, 1)
          )
        )
      
      for (const match of round1Matches) {
        if (match.team1Id && match.team2Id) {
          const score1 = match.team1Id === team.id ? 10 : 7
          const score2 = match.team1Id === team.id ? 7 : 10
          await updateMatchScoreAction(tournamentSlug, match.id, score1, score2)
        }
      }
      
      const result = await getTeamDetailsAction(tournamentSlug, team.id)
      
      expect(result.team!.buchholzDetails).toBeDefined()
      expect(result.team!.buchholzDetails.totalOpponents).toBeGreaterThanOrEqual(1)
      expect(result.team!.buchholzDetails.medianBuchholzScore).toBeGreaterThanOrEqual(0)
      expect(result.team!.buchholzDetails.opponentDetails).toBeDefined()
      expect(result.team!.opponentsBuchholzScore).toBeDefined()
    })

    it('should calculate correct ranking', async () => {
      // Complete round 1 with specific results
      const round1Matches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, tournamentId),
            eq(matches.roundNumber, 1)
          )
        )
      
      // Make team at index 0 win, team at index 1 lose
      for (let i = 0; i < round1Matches.length; i++) {
        const match = round1Matches[i]
        if (match.team1Id && match.team2Id) {
          const team1Wins = match.team1Id === testTeams[0].id || i % 2 === 0
          const score1 = team1Wins ? 10 : 5
          const score2 = team1Wins ? 5 : 10
          await updateMatchScoreAction(tournamentSlug, match.id, score1, score2)
        }
      }
      
      // Get details for winning team
      const winnerResult = await getTeamDetailsAction(tournamentSlug, testTeams[0].id)
      
      // Get details for a losing team
      const losingTeam = testTeams.find(t => {
        const match = round1Matches.find(m => 
          m.team2Id === t.id && m.team1Id === testTeams[0].id
        )
        return match !== undefined
      })
      
      if (losingTeam) {
        const loserResult = await getTeamDetailsAction(tournamentSlug, losingTeam.id)
        
        // Winner should have better rank than loser
        expect(winnerResult.team!.rank).toBeLessThan(loserResult.team!.rank)
        expect(winnerResult.team!.swissPoints).toBeGreaterThan(loserResult.team!.swissPoints || 0)
      }
    })

    it('should track match history correctly', async () => {
      const team = testTeams[0]
      
      // Complete 3 full rounds
      for (let round = 1; round <= 3; round++) {
        const roundMatches = await db
          .select()
          .from(matches)
          .where(
            and(
              eq(matches.tournamentId, tournamentId),
              eq(matches.roundNumber, round)
            )
          )
        
        for (const match of roundMatches) {
          if (match.team1Id && match.team2Id) {
            // Team 0 wins round 1, loses round 2, draws round 3
            let score1, score2
            if (match.team1Id === team.id || match.team2Id === team.id) {
              if (round === 1) {
                score1 = match.team1Id === team.id ? 10 : 5
                score2 = match.team1Id === team.id ? 5 : 10
              } else if (round === 2) {
                score1 = match.team1Id === team.id ? 6 : 10
                score2 = match.team1Id === team.id ? 10 : 6
              } else {
                score1 = 8
                score2 = 8
              }
            } else {
              score1 = 10
              score2 = 7
            }
            await updateMatchScoreAction(tournamentSlug, match.id, score1, score2)
          }
        }
      }
      
      const result = await getTeamDetailsAction(tournamentSlug, team.id)
      
      expect(result.team!.pastMatches.length).toBe(3)
      expect(result.team!.swissWins).toBe(1)
      expect(result.team!.swissLosses).toBe(1)
      expect(result.team!.swissDraws).toBe(1)
      expect(result.team!.swissPoints).toBe(4) // 3 + 0 + 1
      
      // Verify match details
      const round1Match = result.team!.pastMatches.find(m => m.roundNumber === 1)
      const round2Match = result.team!.pastMatches.find(m => m.roundNumber === 2)
      const round3Match = result.team!.pastMatches.find(m => m.roundNumber === 3)
      
      expect(round1Match!.winnerId).toBe(team.id)
      expect(round2Match!.winnerId).not.toBe(team.id)
      expect(round3Match!.winnerId).toBeNull() // Draw
    })

    it('should handle team not in tournament', async () => {
      const result = await getTeamDetailsAction(tournamentSlug, 999999)
      
      expect(result.team).toBeNull()
      expect(result.error).toBe('Team not found')
    })

    it('should handle invalid tournament slug', async () => {
      const result = await getTeamDetailsAction('invalid-slug', testTeams[0].id)
      
      expect(result.team).toBeNull()
      expect(result.error).toBe('Team not found')
    })

    it('should show correct table number for next match', async () => {
      // Get multiple teams and verify table numbers are distributed
      const teamResults = await Promise.all(
        testTeams.slice(0, 4).map(team => 
          getTeamDetailsAction(tournamentSlug, team.id)
        )
      )
      
      const tableNumbers = teamResults
        .map(r => r.team?.nextMatch?.tableNumber)
        .filter(Boolean)
      
      // All teams should have table numbers
      expect(tableNumbers.length).toBe(4)
      
      // Table numbers should be between 1 and 38
      tableNumbers.forEach(tableNum => {
        expect(tableNum).toBeGreaterThanOrEqual(1)
        expect(tableNum).toBeLessThanOrEqual(38)
      })
      
      // Teams playing each other should have same table number
      const match1Teams = teamResults.filter(r => 
        r.team?.nextMatch?.tableNumber === tableNumbers[0]
      )
      expect(match1Teams.length).toBe(2) // Two teams at same table
    })
  })
})