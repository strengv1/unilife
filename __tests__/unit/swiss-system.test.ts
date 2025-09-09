import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SwissSystem } from '@/lib/tournament-logic'

// Mock the dependencies at the module level
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      matches: {
        findFirst: vi.fn(),
        findMany: vi.fn()
      },
      teams: {
        findFirst: vi.fn(),
        findMany: vi.fn()
      }
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn()
      }))
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn()
      }))
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn()
      }))
    }))
  },
  NewMatch: class {}
}))

vi.mock('@/lib/buccholz-calculator', () => ({
  BuchholzCalculator: {
    calculateAllBuchholzScores: vi.fn(),
    clearCache: vi.fn()
  }
}))

describe('SwissSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  describe('isByeMatch', () => {
    it('should correctly identify bye matches', () => {
      expect(SwissSystem.isByeMatch({ team1Id: 1, team2Id: null })).toBe(true)
      expect(SwissSystem.isByeMatch({ team1Id: 1, team2Id: 2 })).toBe(false)
      expect(SwissSystem.isByeMatch({ team1Id: null, team2Id: 2 })).toBe(false)
      expect(SwissSystem.isByeMatch({ team1Id: null, team2Id: null })).toBe(false)
    })
  })
})