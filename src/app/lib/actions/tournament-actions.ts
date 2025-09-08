'use server'

import { revalidatePath } from 'next/cache'
import { db, Match, StandingWithPosition, Team } from '@/app/lib/db'
import { tournaments, teams, matches } from '@/app/lib/schema'
import { verifyAuth } from '@/app/lib/auth'
import { desc, eq, and, asc } from 'drizzle-orm'
import { SwissSystem } from '../tournament-logic'
import { alias } from 'drizzle-orm/pg-core'

export async function getTournamentsAction() {
  try {
    const tournamentList = await db
      .select()
      .from(tournaments)
      .orderBy(desc(tournaments.createdAt));
    
    return { success: true, tournaments: tournamentList }
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return { error: 'Failed to fetch tournaments' }
  }
}

export async function createTournamentAction(formData: FormData) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const type = formData.get('type') as string;
    const swissRounds = parseInt(formData.get('swissRounds') as string);
    const eliminationTeams = parseInt(formData.get('eliminationTeams') as string);
    const teamsText = formData.get('teams') as string;

    // Validate slug format
    const isValidSlug = /^[a-z0-9-]+$/.test(slug);
    if (!isValidSlug) {
      return { error: 'Invalid slug: only lowercase letters, digits, and hyphens allowed.' }
    }

    // Create tournament
    const [tournament] = await db
      .insert(tournaments)
      .values({
        name,
        slug,
        type,
        swissRounds,
        eliminationTeams,
        status: 'registration',
      })
      .returning();

    // Add teams if provided
    if (teamsText && teamsText.trim()) {
      const teamNames = teamsText
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Check for duplicate names
      const teamValidation = await validateTeamNamesAction(slug, teamNames);
      const invalid = teamValidation.validation?.filter(v => !v.isValid);
      if (invalid && invalid.length > 0) {
        return { error: 'Invalid team names: ' + invalid.map(v => v.name).join(', ') };
      }

      for (const teamName of teamNames) {
        await db
          .insert(teams)
          .values({
            tournamentId: tournament.id,
            name: teamName,
          });
      }
    }

    // Revalidate the admin page
    revalidatePath('/admin')
    
    return { success: true, tournament }
  } catch (error) {
    console.error('Error creating tournament:', error);
    return { error: 'Failed to create tournament' }
  }
}

export async function deleteTournamentAction(tournamentId: number) {
  try {
    // Start a transaction to ensure all deletes happen atomically
    await db.transaction(async (tx) => {
      // First, delete all matches for this tournament
      await tx
        .delete(matches)
        .where(eq(matches.tournamentId, tournamentId));
      
      // Then, delete all teams for this tournament
      await tx
        .delete(teams)
        .where(eq(teams.tournamentId, tournamentId));
      
      // Finally, delete the tournament itself
      await tx
        .delete(tournaments)
        .where(eq(tournaments.id, tournamentId));
    });

    return { success: true, message: 'Tournament deleted successfully' };
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return { error: 'Failed to delete tournament' };
  }
}

export async function validateTeamNamesAction(tournamentSlug: string, teamNames: string[]) {
  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, tournamentSlug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Get existing teams
    const existingTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    const existingNames = new Set(existingTeams.map((t: Team) => t.name.toLowerCase()));

    // Check for duplicates
    const validation = teamNames.map((name: string) => {
      const trimmed = name.trim();
      const isValid = trimmed.length > 0 && !existingNames.has(trimmed.toLowerCase());
      return {
        name: trimmed,
        isValid,
        error: !isValid ? (trimmed.length === 0 ? 'Empty name' : 'Duplicate name') : null
      };
    });

    // Check for duplicates within the provided list
    const nameCount = new Map<string, number>();
    teamNames.forEach((name: string) => {
      const lower = name.trim().toLowerCase();
      nameCount.set(lower, (nameCount.get(lower) || 0) + 1);
    });

    validation.forEach((item) => {
      if (item.isValid && nameCount.get(item.name.toLowerCase())! > 1) {
        item.isValid = false;
        item.error = 'Duplicate in list';
      }
    });

    return { success: true, validation }
  } catch (error) {
    console.error('Error validating teams:', error);
    return { error: 'Failed to validate teams' }
  }
}

export async function getTournamentBySlugAction(slug: string) {
  try {
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, slug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }
    return { success: true, tournament }
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return { error: 'Failed to fetch tournament' }
  }
}

export async function getTeamsByTournamentSlugAction(slug: string) {
  try {
    // Find tournament first
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, slug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Get teams
    const teamList = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    return { success: true, teams: teamList }
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { error: 'Failed to fetch teams' }
  }
}

export async function updateTournamentSettingsAction(
  slug: string,
  swissRounds: number,
  eliminationTeams: number
) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    const [tournament] = await db
      .update(tournaments)
      .set({
        swissRounds,
        eliminationTeams,
        updatedAt: new Date()
      })
      .where(eq(tournaments.slug, slug))
      .returning();

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Revalidate relevant pages
    revalidatePath(`/admin/tournaments/${slug}`)
    revalidatePath(`/events/${slug}/bracket`)

    return { success: true, tournament }
  } catch (error) {
    console.error('Error updating tournament:', error);
    return { error: 'Failed to update tournament settings' }
  }
}

export async function deleteTeamAction(tournamentSlug: string, teamId: number) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, tournamentSlug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Delete team (with tournament ownership check)
    const deletedTeams = await db
      .delete(teams)
      .where(
        and(
          eq(teams.id, teamId),
          eq(teams.tournamentId, tournament.id)
        )
      )
      .returning();

    if (deletedTeams.length === 0) {
      return { error: 'Team not found or not authorized to delete' }
    }

    // Revalidate relevant pages
    revalidatePath(`/admin/tournaments/${tournamentSlug}`)
    revalidatePath(`/events/${tournamentSlug}/bracket`)

    return { success: true, message: 'Team deleted successfully' }
  } catch (error) {
    console.error('Error deleting team:', error);
    return { error: 'Failed to delete team' }
  }
}

export async function addMultipleTeamsAction(tournamentSlug: string, teamNames: string[]) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' };
  }

  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, tournamentSlug));

    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Validate team names using the shared action
    const validationResult = await validateTeamNamesAction(tournamentSlug, teamNames);

    if (!validationResult.success) {
      return { error: validationResult.error || 'Failed to validate team names' };
    }

    const validation = validationResult.validation!;
    const invalid = validation.filter(v => !v.isValid);

    if (invalid.length > 0) {
      // Return human-readable errors for all invalid names
      return { error: invalid.map(v => `${v.name || '(empty)'}: ${v.error}`).join(', ') };
    }

    // Only add valid names
    const results = [];
    for (const v of validation) {
      const [team] = await db
        .insert(teams)
        .values({
          tournamentId: tournament.id,
          name: v.name,
        })
        .returning();
      results.push(team);
    }

    // Revalidate relevant pages
    revalidatePath(`/admin/tournaments/${tournamentSlug}`);
    revalidatePath(`/events/${tournamentSlug}/bracket`);

    return {
      success: true,
      teams: results,
      message: `Added ${results.length} team(s)`
    };
  } catch (error) {
    console.error('Error adding teams:', error);
    return { error: 'Failed to add teams' };
  }
}

export async function startTournamentAction(slug: string) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, slug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    if (tournament.status !== 'registration') {
      return { error: 'Tournament already started' }
    }

    // Get all teams
    const teamList = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    if (teamList.length < 2) {
      return { error: 'Need at least 2 teams to start' }
    }

    // Update tournament status
    await db
      .update(tournaments)
      .set({ status: 'swiss' })
      .where(eq(tournaments.id, tournament.id));

    // Generate first Swiss round
    await SwissSystem.generateSwissRound(tournament.id, 1);

    // Revalidate relevant pages
    revalidatePath(`/admin/tournaments/${slug}`)
    revalidatePath(`/events/${slug}/bracket`)

    return { success: true, message: 'Tournament started' }
  } catch (error) {
    console.error('Error starting tournament:', error);
    return { error: 'Failed to start tournament' }
  }
}

export async function getStandingsAction(slug: string) {
  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, slug));
   
    if (!tournament) {
      return { error: 'Tournament not found' }
    }
    
    const standings = await SwissSystem.getStandings(tournament.id);

    // Add position for each team
    const standingsWithPosition: StandingWithPosition[] = standings.map((team, index) => ({
      ...team,
      position: index + 1
    }));
    
    return { success: true, standings: standingsWithPosition }
  } catch (error) {
    console.error('Error fetching standings:', error);
    return { error: 'Failed to fetch standings' }
  }
}

export async function fetchMatchesAction(tournamentSlug: string, status: string) {
  try {
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, tournamentSlug));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Create aliases for teams
    const team1 = alias(teams, 'team1');
    const team2 = alias(teams, 'team2');

    // Build query conditions
    const conditions = [eq(matches.tournamentId, tournament.id)];
    
    if (status && status !== 'all') {
      conditions.push(eq(matches.status, status));
    }

    // Get matches with team information
    const rawMatches = await db
      .select({
        id: matches.id,
        tournamentId: matches.tournamentId,
        roundNumber: matches.roundNumber,
        matchNumber: matches.matchNumber,
        phase: matches.phase,
        team1Id: matches.team1Id,
        team2Id: matches.team2Id,
        team1Score: matches.team1Score,
        team2Score: matches.team2Score,
        winnerId: matches.winnerId,
        status: matches.status,
        bracketPosition: matches.bracketPosition,
        nextMatchId: matches.nextMatchId,
        team1: {
          id: team1.id,
          name: team1.name,
          seed: team1.seed,
        },
        team2: {
          id: team2.id,
          name: team2.name,
          seed: team2.seed,
        },
      })
      .from(matches)
      .leftJoin(team1, eq(team1.id, matches.team1Id))
      .leftJoin(team2, eq(team2.id, matches.team2Id))
      .where(and(...conditions))
      .orderBy(asc(matches.roundNumber), asc(matches.matchNumber));

    // Transform to match the expected Match type
    const matchList = rawMatches.map(match => ({
      ...match,
      team1: match.team1 ? {
        id: match.team1.id!,
        name: match.team1.name!,
        seed: match.team1.seed!,
      } : null,
      team2: match.team2 ? {
        id: match.team2.id!,
        name: match.team2.name!,
        seed: match.team2.seed!,
      } : null,
    })) as Match[];

    return { success: true, matches: matchList }
  } catch (error) {
    console.error('Error fetching matches:', error);
    return { error: 'Failed to fetch matches' }
  }
}