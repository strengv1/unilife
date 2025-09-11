import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import '../../src/test/setup'
import { 
  createTournamentAction,
  getTournamentsAction,
  getTeamsByTournamentSlugAction,
  updateTournamentSettingsAction,
  deleteTeamAction,
  addMultipleTeamsAction,
  startTournamentAction,
  getStandingsAction,
  validateTeamNamesAction,
  deleteTournamentAction
} from '@/lib/actions/tournament-actions'
import { db } from '@/lib/db'
import { teams, matches, tournaments } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { verifyAuth } from '@/lib/auth'

// Mock the auth verification for testing
vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn().mockResolvedValue(true),
  checkPassword: vi.fn().mockReturnValue(true),
  createToken: vi.fn().mockReturnValue('test-token'),
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  unstable_cache: vi.fn().mockImplementation((fn: Function) => {
    // Return a function that just calls the original function without caching
    return (...args: any[]) => fn(...args)
  })
}))

describe('Tournament Actions Integration Tests', () => {
  describe('createTournamentAction', () => {
    it('should create a tournament with teams', async () => {
      const formData = new FormData()
      formData.set('name', 'Spring Championship 2024')
      formData.set('slug', 'spring-2024')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '5')
      formData.set('eliminationTeams', '16')
      formData.set('teams', 'Alpha Team\nBeta Squad\nGamma Force\nDelta Unit')
      
      const result = await createTournamentAction(formData)
      
      expect(result.success).toBe(true)
      expect(result.tournament).toBeDefined()
      expect(result.tournament!.name).toBe('Spring Championship 2024')
      expect(result.tournament!.slug).toBe('spring-2024')
      expect(result.tournament!.swissRounds).toBe(5)
      expect(result.tournament!.eliminationTeams).toBe(16)
      expect(result.tournament!.status).toBe('registration')
      
      // Verify teams were created
      const createdTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, result.tournament!.id))
      
      expect(createdTeams.length).toBe(4)
      expect(createdTeams.map(t => t.name)).toContain('Alpha Team')
      expect(createdTeams.map(t => t.name)).toContain('Delta Unit')
    })

    it('should reject invalid slug format', async () => {
      const formData = new FormData()
      formData.set('name', 'Test Tournament')
      formData.set('slug', 'Invalid Slug!') // Contains space and special char
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      
      const result = await createTournamentAction(formData)
      
      expect(result.error).toContain('Invalid slug')
    })

    it('should create tournament without initial teams', async () => {
      const formData = new FormData()
      formData.set('name', 'Empty Tournament')
      formData.set('slug', 'empty-tourney')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', '') // No teams
      
      const result = await createTournamentAction(formData)
      
      expect(result.success).toBe(true)
      
      const createdTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, result.tournament!.id))
      
      expect(createdTeams.length).toBe(0)
    })

    it('should fail if credentials are invalid', async () => {
      (verifyAuth as Mock).mockResolvedValueOnce(false)

      const formData = new FormData()
      formData.set('name', 'Unauthorized Tournament')
      formData.set('slug', 'unauth-2025')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      
      const result = await createTournamentAction(formData)
      
      expect(result.error).toContain('Unauthorized')
    })
  })

  describe('deleteTournamentAction', () => {
    it('should successfully delete a tournament and all related data', async () => {
      // First create a tournament with teams and matches
      const formData = new FormData()
      formData.set('name', 'Test Tournament')
      formData.set('slug', 'test-tournament')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '5')
      formData.set('eliminationTeams', '16')
      
      const createResult = await createTournamentAction(formData)
      
      expect(createResult.success).toBe(true);
      const tournamentId = createResult.tournament!.id;
  
      // Add some teams
      await db.insert(teams).values([
        { tournamentId, name: 'Team 1' },
        { tournamentId, name: 'Team 2' }
      ]);
  
      // Add some matches
      await db.insert(matches).values([
        { 
          tournamentId, 
          roundNumber: 1, 
          matchNumber: 1, 
          phase: 'swiss',
          team1Id: 1,
          team2Id: 2
        }
      ]);
  
      // Delete the tournament
      const deleteResult = await deleteTournamentAction(tournamentId);
  
      expect(deleteResult).toEqual({
        success: true,
        message: 'Tournament deleted successfully'
      });
  
      // Verify tournament is deleted
      const tournamentCheck = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, tournamentId));
      expect(tournamentCheck).toHaveLength(0);
  
      // Verify teams are deleted
      const teamsCheck = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId));
      expect(teamsCheck).toHaveLength(0);
  
      // Verify matches are deleted
      const matchesCheck = await db
        .select()
        .from(matches)
        .where(eq(matches.tournamentId, tournamentId));
      expect(matchesCheck).toHaveLength(0);
    });
  
    it('should handle deleting non-existent tournament', async () => {
      const result = await deleteTournamentAction(99999);
  
      // Should still return success even if tournament doesn't exist
      expect(result).toEqual({
        success: true,
        message: 'Tournament deleted successfully'
      });
    });
  
    it('should handle database errors gracefully', async () => {
      // Create a spy to simulate database error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock db.transaction to throw an error
      const originalTransaction = db.transaction;
      db.transaction = vi.fn().mockRejectedValue(new Error('Database error'));
  
      const result = await deleteTournamentAction(1);
  
      expect(result).toEqual({
        error: 'Failed to delete tournament'
      });
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting tournament:', expect.any(Error));
  
      // Restore original transaction
      db.transaction = originalTransaction;
      consoleSpy.mockRestore();
    });
  
    it('should delete tournament with no related data', async () => {
      // Create a tournament without teams or matches
      const formData = new FormData()
      formData.set('name', 'Empty Tournament')
      formData.set('slug', 'empty-tournament')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '5')
      formData.set('eliminationTeams', '16')
      
      const createResult = await createTournamentAction(formData)
      
      expect(createResult.success).toBe(true);
      const tournamentId = createResult.tournament!.id;
  
      const deleteResult = await deleteTournamentAction(tournamentId);
  
      expect(deleteResult).toEqual({
        success: true,
        message: 'Tournament deleted successfully'
      });
  
      // Verify tournament is deleted
      const tournamentCheck = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, tournamentId));
      expect(tournamentCheck).toHaveLength(0);
    });
  
    it('should handle invalid tournament ID types', async () => {
      const result = await deleteTournamentAction(0);
  
      expect(result).toEqual({
        success: true,
        message: 'Tournament deleted successfully'
      });
    });
  });

  describe('getTournamentsAction', () => {
    it('should return all tournaments', async () => {
      // Create a few tournaments
      for (let i = 1; i <= 3; i++) {
        const formData = new FormData()
        formData.set('name', `Tournament ${i}`)
        formData.set('slug', `tournament-${i}`)
        formData.set('type', 'swiss_elimination')
        formData.set('swissRounds', '3')
        formData.set('eliminationTeams', '8')
        await createTournamentAction(formData)
      }
      
      const result = await getTournamentsAction()
      
      expect(result.success).toBe(true)
      expect(result.tournaments).toBeDefined()
      expect(result.tournaments!.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('validateTeamNamesAction', () => {
    let tournamentSlug: string

    beforeEach(async () => {
      const formData = new FormData()
      formData.set('name', 'Validation Test')
      formData.set('slug', `val-test-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', 'Existing Team\nAnother Team')
      
      const result = await createTournamentAction(formData)
      tournamentSlug = result.tournament!.slug
    })

    it('should validate team names for duplicates', async () => {
      const namesToValidate = [
        'New Team',
        'Existing Team', // Duplicate
        'Another New Team',
        '', // Empty
        'new team' // Different case, but still unique
      ]
      const result = await validateTeamNamesAction(tournamentSlug, namesToValidate)
      
      expect(result.success).toBe(true)
      expect(result.validation).toBeDefined()
      
      const validation = result.validation!

      expect(validation[0].isValid).toBe(false)
      expect(validation[0].error).toBe('Duplicate in list')
      expect(validation[1].isValid).toBe(false) // Existing Team
      expect(validation[1].error).toBe('Duplicate name')
      expect(validation[2].isValid).toBe(true) // Another New Team
      expect(validation[3].isValid).toBe(false) // Empty
      expect(validation[3].error).toBe('Empty name')
      expect(validation[4].isValid).toBe(false) // new team (duplicate in list, case-insensitive)
      expect(validation[4].error).toBe('Duplicate in list')
    })

    it('should detect duplicates within provided list', async () => {
      const namesToValidate = [
        'Team A',
        'Team B',
        'Team A', // Duplicate in list
      ]
      
      const result = await validateTeamNamesAction(tournamentSlug, namesToValidate)
      
      const validation = result.validation!
      expect(validation[0].isValid).toBe(false) // First Team A
      expect(validation[0].error).toBe('Duplicate in list')
      expect(validation[2].isValid).toBe(false) // Second Team A
      expect(validation[2].error).toBe('Duplicate in list')
    })
  })

  describe('team management', () => {
    let tournamentSlug: string
    let tournamentId: number

    beforeEach(async () => {
      const formData = new FormData()
      formData.set('name', 'Team Management Test')
      formData.set('slug', `team-mgmt-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', 'Team 1\nTeam 2\nTeam 3')
      
      const result = await createTournamentAction(formData)
      tournamentSlug = result.tournament!.slug
      tournamentId = result.tournament!.id
    })

    it('should add multiple teams', async () => {
      const newTeams = ['Team 4', 'Team 5', 'Team 6']
      
      const result = await addMultipleTeamsAction(tournamentSlug, newTeams)
      
      expect(result.success).toBe(true)
      expect(result.teams!.length).toBe(3)
      expect(result.message).toBe('Added 3 team(s)')
      
      const allTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId))
      
      expect(allTeams.length).toBe(6)
    })

    it('should reject duplicate team names when adding', async () => {
      const newTeams = ['Team 1', 'Team 7'] // Team 1 already exists
      
      const result = await addMultipleTeamsAction(tournamentSlug, newTeams)

      expect(result.error).toContain('Team 1: Duplicate name')
    })

    it('should delete a team', async () => {
      const existingTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId))
      
      const teamToDelete = existingTeams[0]
      
      const result = await deleteTeamAction(tournamentSlug, teamToDelete.id)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Team deleted successfully')
      
      const remainingTeams = await db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId))
      
      expect(remainingTeams.length).toBe(2)
      expect(remainingTeams.find(t => t.id === teamToDelete.id)).toBeUndefined()
    })

    it('should update tournament settings', async () => {
      const result = await updateTournamentSettingsAction(tournamentSlug, 6, 32)
      
      expect(result.success).toBe(true)
      
      const [updated] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.slug, tournamentSlug))
      
      expect(updated.swissRounds).toBe(6)
      expect(updated.eliminationTeams).toBe(32)
    })

  })

  describe('startTournamentAction', () => {
    it('should start tournament and generate first round', async () => {
      const formData = new FormData()
      formData.set('name', 'Start Test')
      formData.set('slug', `start-test-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '4')
      formData.set('teams', 'A\nB\nC\nD\nE\nF\nG\nH')
      
      const createResult = await createTournamentAction(formData)
      const tournamentSlug = createResult.tournament!.slug
      const tournamentId = createResult.tournament!.id
      
      const startResult = await startTournamentAction(tournamentSlug)
      
      expect(startResult.success).toBe(true)
      expect(startResult.message).toBe('Tournament started')
      
      // Check tournament status
      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, tournamentId))
      
      expect(tournament.status).toBe('swiss')
      
      // Check first round matches were created
      const round1Matches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, tournamentId),
            eq(matches.roundNumber, 1)
          )
        )  
      
      expect(round1Matches.length).toBe(4) // 8 teams = 4 matches
    })

    it('should reject starting with less than 2 teams', async () => {
      const formData = new FormData()
      formData.set('name', 'Small Tournament')
      formData.set('slug', `small-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '4')
      formData.set('teams', 'Only One Team')
      
      const createResult = await createTournamentAction(formData)
      const result = await startTournamentAction(createResult.tournament!.slug)
      
      expect(result.error).toBe('Need at least 2 teams to start')
    })

    it('should not start already started tournament', async () => {
      const formData = new FormData()
      formData.set('name', 'Double Start Test')
      formData.set('slug', `double-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '4')
      formData.set('teams', 'A\nB')
      
      const createResult = await createTournamentAction(formData)
      const tournamentSlug = createResult.tournament!.slug
      
      await startTournamentAction(tournamentSlug)
      const secondStart = await startTournamentAction(tournamentSlug)
      
      expect(secondStart.error).toBe('Tournament already started')
    })
  })

  describe('getStandingsAction', () => {
    it('should return current standings with positions', async () => {
      // Create and start a tournament
      const formData = new FormData()
      formData.set('name', 'Standings Test')
      formData.set('slug', `standings-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '4')
      formData.set('teams', 'Team A\nTeam B\nTeam C\nTeam D')
      
      const createResult = await createTournamentAction(formData)
      const tournamentSlug = createResult.tournament!.slug
      await startTournamentAction(tournamentSlug)
      
      // Simulate some matches
      const matchesResult = await db
        .select()
        .from(matches)
        .where(eq(matches.tournamentId, createResult.tournament!.id))
      
      // Team A wins against Team B (assuming they're paired)
      const match1 = matchesResult[0]
      await db.update(matches).set({
        team1Score: 10,
        team2Score: 5,
        winnerId: match1.team1Id,
        status: 'completed'
      }).where(eq(matches.id, match1.id))
      
      // Update team standings manually for test
      await db.update(teams).set({
        swissPoints: 3,
        swissWins: 1,
        swissGamePointsFor: 10,
        swissGamePointsAgainst: 5
      }).where(eq(teams.id, match1.team1Id!))
      
      await db.update(teams).set({
        swissPoints: 0,
        swissLosses: 1,
        swissGamePointsFor: 5,
        swissGamePointsAgainst: 10
      }).where(eq(teams.id, match1.team2Id!))
      
      const result = await getStandingsAction(tournamentSlug)
      
      expect(result.success).toBe(true)
      expect(result.standings).toBeDefined()
      expect(result.standings!.length).toBe(4)
      
      // Check positions are assigned
      result.standings!.forEach((team, index) => {
        expect(team.position).toBe(index + 1)
      })
      
      // Verify sorting (team with 3 points should be first)
      expect(result.standings![0].swissPoints).toBe(3)
      expect(result.standings![0].swissGamePointsFor).toBe(10)
    })
  })

  describe('Authorization checks', () => {
    it('should reject unauthorized tournament creation', async () => {
      const { verifyAuth } = await import('@/lib/auth')
      vi.mocked(verifyAuth).mockResolvedValueOnce(false)
      
      const formData = new FormData()
      formData.set('name', 'Unauthorized Tournament')
      formData.set('slug', 'unauth-tourney')
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      
      const result = await createTournamentAction(formData)
      
      expect(result.error).toBe('Unauthorized')
    })

    it('should reject unauthorized tournament update', async () => {
      // First create a tournament with auth enabled
      const formData = new FormData()
      formData.set('name', 'Auth Test')
      formData.set('slug', `auth-test-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', 'Team to Delete')
      
      const createResult = await createTournamentAction(formData)
      const tournamentSlug = createResult.tournament!.slug

      // Now disable auth and try to update
      const { verifyAuth } = await import('@/lib/auth')
      vi.mocked(verifyAuth).mockResolvedValueOnce(false)
      
      const updateTournamentResult = await updateTournamentSettingsAction(tournamentSlug, 6, 32);
      expect(updateTournamentResult.error).toContain('Unauthorized');

      const [tournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.slug, tournamentSlug))

      expect(tournament.swissRounds).toBe(3)
      expect(tournament.eliminationTeams).toBe(8)
    })

    it('should reject unauthorized team deletion', async () => {
      // First create a tournament with auth enabled
      const formData = new FormData()
      formData.set('name', 'Auth Test')
      formData.set('slug', `auth-test-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', 'Team to Delete')
      
      const createResult = await createTournamentAction(formData)
      const tournamentSlug = createResult.tournament!.slug
      
      const teamsResult = await getTeamsByTournamentSlugAction(tournamentSlug)
      const teamId = teamsResult.teams![0].id
      
      // Now disable auth and try to delete
      const { verifyAuth } = await import('@/lib/auth')
      vi.mocked(verifyAuth).mockResolvedValueOnce(false)
      
      const deleteResult = await deleteTeamAction(tournamentSlug, teamId)
      
      expect(deleteResult.error).toBe('Unauthorized')
    })

    it('should reject unauthorized tournament deletion', async () => {
      // First create a tournament with auth enabled
      const formData = new FormData()
      formData.set('name', 'Auth Test')
      formData.set('slug', `auth-test-${Date.now()}`)
      formData.set('type', 'swiss_elimination')
      formData.set('swissRounds', '3')
      formData.set('eliminationTeams', '8')
      formData.set('teams', 'Team to Delete')
      
      const createResult = await createTournamentAction(formData)
      const tournamentId = createResult.tournament!.id
      
      // Now disable auth and try to delete
      const { verifyAuth } = await import('@/lib/auth')
      vi.mocked(verifyAuth).mockResolvedValueOnce(false)
      
      const deleteResult = await deleteTournamentAction(tournamentId)
      
      expect(deleteResult.error).toBe('Unauthorized')
    })
  })
})