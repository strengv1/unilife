import { db } from '@/app/lib/db'
import { tournaments, teams, matches } from '@/app/lib/schema'
import { eq, and } from 'drizzle-orm'
import { faker } from '@faker-js/faker'

export interface TestTournamentOptions {
  name?: string
  slug?: string
  teamCount?: number
  swissRounds?: number
  eliminationTeams?: number
  status?: string
  teamNames?: string[]
}

/**
 * Create a test tournament with teams
 */
export async function createTestTournament(options: TestTournamentOptions = {}) {
  const {
    name = faker.company.name() + ' Tournament',
    slug = faker.helpers.slugify(name).toLowerCase(),
    teamCount = 8,
    swissRounds = 3,
    eliminationTeams = 4,
    status = 'registration',
    teamNames = []
  } = options

  // Create tournament
  const [tournament] = await db
    .insert(tournaments)
    .values({
      name,
      slug,
      type: 'swiss_elimination',
      status,
      swissRounds,
      eliminationTeams,
    })
    .returning()

  // Create teams
  const teamsToCreate = teamNames.length > 0 
    ? teamNames 
    : Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`)

  const createdTeams = await db
    .insert(teams)
    .values(
      teamsToCreate.map(teamName => ({
        tournamentId: tournament.id,
        name: teamName,
      }))
    )
    .returning()

  return { tournament, teams: createdTeams }
}

/**
 * Get all matches for a tournament
 */
export async function getTournamentMatches(tournamentId: number) {
  return db
    .select()
    .from(matches)
    .where(eq(matches.tournamentId, tournamentId))
    .orderBy(matches.roundNumber, matches.matchNumber)
}

/**
 * Get teams with their current standings
 */
export async function getTournamentTeams(tournamentId: number) {
  return db
    .select()
    .from(teams)
    .where(eq(teams.tournamentId, tournamentId))
    .orderBy(teams.swissPoints, teams.swissGamePointsFor)
}

/**
 * Assert Swiss pairing invariants
 */
export function assertSwissInvariants(
  matchList: any[],
  teamList: any[]
): {
  noRepeatedPairings: boolean
  allTeamsPlaying: boolean
  atMostOneBye: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check 1: No repeated pairings
  const pairings = new Map<string, number>()
  matchList.forEach(match => {
    if (match.team1Id && match.team2Id) {
      const key = [match.team1Id, match.team2Id].sort().join('-')
      const count = (pairings.get(key) || 0) + 1
      pairings.set(key, count)
      
      if (count > 1) {
        errors.push(`Teams ${match.team1Id} and ${match.team2Id} played ${count} times`)
      }
    }
  })
  
  // Check 2: All teams playing each round (except bye)
  const roundsMap = new Map<number, Set<number>>()
  matchList.forEach(match => {
    if (!roundsMap.has(match.roundNumber)) {
      roundsMap.set(match.roundNumber, new Set())
    }
    const round = roundsMap.get(match.roundNumber)!
    if (match.team1Id) round.add(match.team1Id)
    if (match.team2Id) round.add(match.team2Id)
  })
  
  const allTeamsPlaying = Array.from(roundsMap.values()).every(
    round => round.size >= teamList.length - 1 // -1 for potential bye
  )
  
  if (!allTeamsPlaying) {
    errors.push('Not all teams are playing in each round')
  }
  
  // Check 3: At most one bye per team
  const byeCounts = new Map<number, number>()
  matchList.forEach(match => {
    if (match.team1Id && !match.team2Id) {
      const count = (byeCounts.get(match.team1Id) || 0) + 1
      byeCounts.set(match.team1Id, count)
      
      if (count > 1) {
        errors.push(`Team ${match.team1Id} received ${count} byes`)
      }
    }
  })
  
  return {
    noRepeatedPairings: Array.from(pairings.values()).every(count => count === 1),
    allTeamsPlaying,
    atMostOneBye: Array.from(byeCounts.values()).every(count => count <= 1),
    errors
  }
}