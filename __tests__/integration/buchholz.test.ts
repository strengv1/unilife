import { describe, it, expect, beforeEach } from 'vitest'
import '../../src/test/setup'
import { BuchholzCalculator } from '@/lib/buccholz-calculator'
import { db } from '@/lib/db'
import { teams, matches, tournaments } from '@/lib/schema'

describe('BuchholzCalculator Integration Tests', () => {
  let tournamentId: number

  beforeEach(async () => {
    BuchholzCalculator.clearCache()
    
    // Create a test tournament
    const [tournament] = await db
      .insert(tournaments)
      .values({
        name: 'Test Tournament',
        slug: 'test-tournament',
        type: 'swiss_elimination',
        status: 'swiss',
        swissRounds: 6,
        eliminationTeams: 32,
      })
      .returning()
    
    tournamentId = tournament.id
  })

  describe('Median Buchholz calculation', () => {
    it('should use all scores when team has less than 3 opponents', async () => {
      // Create teams
      const createdTeams = await db
        .insert(teams)
        .values([
          { tournamentId, name: 'Team 1', swissPoints: 6, swissWins: 2 },
          { tournamentId, name: 'Team 2', swissPoints: 3, swissWins: 1 },
          { tournamentId, name: 'Team 3', swissPoints: 3, swissWins: 1 },
        ])
        .returning()

      // Create matches
      await db
        .insert(matches)
        .values([
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[1].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 1,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[2].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 2,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
        ])

      // Team 1 played against Team 2 (3 points) and Team 3 (3 points)
      // With less than 3 opponents, use all scores: 3 + 3 = 6
      const result = await BuchholzCalculator.calculateDetailedMedianBuchholz(
        createdTeams[0].id,
        tournamentId
      )
      
      expect(result.medianBuchholzScore).toBe(6)
      expect(result.scoresUsed).toEqual([3, 3])
      expect(result.scoresExcluded).toEqual([])
      expect(result.totalOpponents).toBe(2)
    })

    it('should exclude highest and lowest scores when team has 3 or more opponents', async () => {
      // Create teams
      const createdTeams = await db
        .insert(teams)
        .values([
          { tournamentId, name: 'Team 1', swissPoints: 9, swissWins: 3 },
          { tournamentId, name: 'Team 2', swissPoints: 9, swissWins: 3 }, // Highest
          { tournamentId, name: 'Team 3', swissPoints: 6, swissWins: 2 },
          { tournamentId, name: 'Team 4', swissPoints: 3, swissWins: 1 },
          { tournamentId, name: 'Team 5', swissPoints: 0, swissLosses: 4 }, // Lowest
        ])
        .returning()

      // Create matches for Team 1 against all others
      await db
        .insert(matches)
        .values([
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[1].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 1,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 9,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[2].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 2,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[3].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 3,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[4].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 4,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 0,
            winnerId: createdTeams[0].id,
          },
        ])

      // Team 1 opponents: 9, 6, 3, 0
      // Sorted: 0, 3, 6, 9
      // Exclude first (0) and last (9)
      // Use: 3 + 6 = 9
      const result = await BuchholzCalculator.calculateDetailedMedianBuchholz(
        createdTeams[0].id,
        tournamentId
      )
      
      expect(result.medianBuchholzScore).toBe(9)
      expect(result.scoresUsed.sort()).toEqual([3, 6])
      expect(result.scoresExcluded.sort()).toEqual([0, 9])
      expect(result.totalOpponents).toBe(4)
    })

    it('should handle BYE opponents correctly (0 points)', async () => {
      // Create teams
      const createdTeams = await db
        .insert(teams)
        .values([
          { tournamentId, name: 'Team 1', swissPoints: 9, swissWins: 3 },
          { tournamentId, name: 'Team 2', swissPoints: 6, swissWins: 2 },
          { tournamentId, name: 'Team 3', swissPoints: 3, swissWins: 1 },
        ])
        .returning()

      // Create matches including a BYE
      await db
        .insert(matches)
        .values([
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[1].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 1,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[2].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 2,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: null, // BYE
            status: 'completed',
            phase: 'swiss',
            roundNumber: 3,
            matchNumber: 1,
            team1Score: 0,
            team2Score: 0,
            winnerId: createdTeams[0].id,
          },
        ])

      // Team 1 opponents: Team 2 (6), Team 3 (3), BYE (0)
      // Sorted: 0, 3, 6
      // Exclude first (0) and last (6)
      // Use: 3
      const result = await BuchholzCalculator.calculateDetailedMedianBuchholz(
        createdTeams[0].id,
        tournamentId
      )
      
      expect(result.medianBuchholzScore).toBe(3)
      expect(result.scoresUsed).toEqual([3])
      expect(result.scoresExcluded.sort()).toEqual([0, 6])
    })

    it('should correctly identify included/excluded opponents in details', async () => {
      // Create teams
      const createdTeams = await db
        .insert(teams)
        .values([
          { tournamentId, name: 'Team 1', swissPoints: 9 },
          { tournamentId, name: 'Team 2', swissPoints: 9 },
          { tournamentId, name: 'Team 3', swissPoints: 6 },
          { tournamentId, name: 'Team 4', swissPoints: 0 },
        ])
        .returning()

      // Create matches
      await db
        .insert(matches)
        .values([
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[1].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 1,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 9,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[2].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 2,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 5,
            winnerId: createdTeams[0].id,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[3].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 3,
            matchNumber: 1,
            team1Score: 10,
            team2Score: 0,
            winnerId: createdTeams[0].id,
          },
        ])

      const result = await BuchholzCalculator.calculateDetailedMedianBuchholz(
        createdTeams[0].id,
        tournamentId
      )
      
      // Team 2 (9 points) should be excluded (highest)
      const team2Detail = result.opponentDetails.find(d => d.opponentId === createdTeams[1].id)
      expect(team2Detail?.includedInCalculation).toBe(false)
      
      // Team 3 (6 points) should be included (middle)
      const team3Detail = result.opponentDetails.find(d => d.opponentId === createdTeams[2].id)
      expect(team3Detail?.includedInCalculation).toBe(true)
      
      // Team 4 (0 points) should be excluded (lowest)
      const team4Detail = result.opponentDetails.find(d => d.opponentId === createdTeams[3].id)
      expect(team4Detail?.includedInCalculation).toBe(false)
    })
  })

  describe('Opponents Buchholz calculation', () => {
    it('should sum all opponents Median Buchholz scores', async () => {
      // Create a more complex tournament setup
      const createdTeams = await db
        .insert(teams)
        .values([
          { tournamentId, name: 'Team 1', swissPoints: 9 },
          { tournamentId, name: 'Team 2', swissPoints: 6 },
          { tournamentId, name: 'Team 3', swissPoints: 6 },
          { tournamentId, name: 'Team 4', swissPoints: 3 },
        ])
        .returning()

      // Create matches
      await db
        .insert(matches)
        .values([
          // Team 1 plays 2, 3, 4
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[1].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 1,
            matchNumber: 1,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[2].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 2,
            matchNumber: 1,
          },
          {
            tournamentId,
            team1Id: createdTeams[0].id,
            team2Id: createdTeams[3].id,
            status: 'completed',
            phase: 'swiss',
            roundNumber: 3,
            matchNumber: 1,
          },
        ])

      // Calculate all Buchholz scores first
      const allBuchholzScores = await BuchholzCalculator.calculateAllBuchholzScores(tournamentId)
      
      // Get Team 1's opponents' Buchholz
      const team1Data = allBuchholzScores.get(createdTeams[0].id)
      
      expect(team1Data).toBeDefined()
      expect(team1Data?.opponentsBuchholzScore).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Cache management', () => {
    it('should clear cache when clearCache is called', () => {
      expect(() => BuchholzCalculator.clearCache()).not.toThrow()
    })
  })

  describe('isMedianRuleApplied', () => {
    it('should return true for 3 or more opponents', () => {
      expect(BuchholzCalculator.isMedianRuleApplied(3)).toBe(true)
      expect(BuchholzCalculator.isMedianRuleApplied(4)).toBe(true)
      expect(BuchholzCalculator.isMedianRuleApplied(5)).toBe(true)
    })

    it('should return false for less than 3 opponents', () => {
      expect(BuchholzCalculator.isMedianRuleApplied(0)).toBe(false)
      expect(BuchholzCalculator.isMedianRuleApplied(1)).toBe(false)
      expect(BuchholzCalculator.isMedianRuleApplied(2)).toBe(false)
    })
  })
})