'use server'

import { db } from '@/lib/db'
import { matches, tournaments, teams } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { verifyAuth } from '@/lib/auth'
import { EliminationBracket, SwissSystem } from '@/lib/tournament-logic'
import { invalidateTournamentCache } from './tournament-actions'

export async function updateMatchScoreAction(
  tournamentSlug: string,
  matchId: number,
  team1Score: number,
  team2Score: number
) {
  // Verify admin authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    // Get the match with tournament info
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));

    if (!match) {
      return { error: 'Match not found' }
    }

    if (!match.tournamentId) {
      return { error: 'Match has no tournament ID' }
    }

    if (!match.team1Id || !match.team2Id) {
      return { error: 'Match is missing teams' }
    }

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, match.tournamentId));

    if (!tournament) {
      return { error: 'Tournament not found' }
    }

    // Check if match was already completed
    const wasAlreadyCompleted = match.status === 'completed';
    const isScoreChanging = wasAlreadyCompleted && 
      (match.team1Score !== team1Score || match.team2Score !== team2Score);

    // Handle score update based on tournament phase
    if (match.phase === 'swiss') {
      // If editing an already completed match, we need to reverse the old scores first
      if (wasAlreadyCompleted && isScoreChanging) {
        // Reverse the old scores
        await SwissSystem.reverseSwissStandings(
          match.team1Score!, 
          match.team2Score!,
          match.team1Id,
          match.team2Id
        );
      }

      // Apply new scores (only if not already completed or if scores changed)
      if (!wasAlreadyCompleted || isScoreChanging) {
        await SwissSystem.updateSwissStandings(matchId, team1Score, team2Score);
      }
      
      // Check if all Swiss matches in current round are complete
      const pendingMatches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, match.tournamentId),
            eq(matches.phase, 'swiss'),
            eq(matches.roundNumber, match.roundNumber),
            eq(matches.status, 'pending')
          )
        );

      const swissRounds = tournament.swissRounds ?? 6;

      // Automagically generate next Swiss Round, or Elimination Bracket, when last match is scored.
      // Only generate next round if this wasn't already processed
      if (!wasAlreadyCompleted && pendingMatches.length === 0 && match.roundNumber < swissRounds) {
        await SwissSystem.generateSwissRound(match.tournamentId, match.roundNumber + 1);
      } else if (!wasAlreadyCompleted && pendingMatches.length === 0 && match.roundNumber === swissRounds) {
        const eliminationTeams = tournament.eliminationTeams ?? 32;
        await SwissSystem.qualifyForElimination(match.tournamentId, eliminationTeams);
        await EliminationBracket.generateBracket(match.tournamentId);
        
        await db
          .update(tournaments)
          .set({ status: 'elimination' })
          .where(eq(tournaments.id, match.tournamentId));
      }
    } else if (match.phase === 'elimination') {
      if (wasAlreadyCompleted) {
        // Check if any dependent matches have been played
        const dependentMatches = await db
          .select()
          .from(matches)
          .where(
            and(
              eq(matches.tournamentId, match.tournamentId),
              eq(matches.id, match.nextMatchId!),
              eq(matches.status, 'completed')
            )
          );

        if (dependentMatches.length > 0) {
          return { 
            error: 'Cannot edit this match because subsequent matches have been played. Reset those matches first.' 
          }
        }

        // Reset the subsequent match if needed
        if (match.nextMatchId) {
          const [nextMatch] = await db
            .select()
            .from(matches)
            .where(eq(matches.id, match.nextMatchId));

          if (nextMatch) {
            // Remove the winner from the next match
            const wasTeam1 = nextMatch.team1Id === match.winnerId;
            const wasTeam2 = nextMatch.team2Id === match.winnerId;
            
            if (wasTeam1) {
              await db
                .update(matches)
                .set({ team1Id: null })
                .where(eq(matches.id, match.nextMatchId));
            } else if (wasTeam2) {
              await db
                .update(matches)
                .set({ team2Id: null })
                .where(eq(matches.id, match.nextMatchId));
            }
          }
        }

        // Un-eliminate the previous loser
        if (match.winnerId) {
          const previousLoserId = match.team1Id === match.winnerId ? match.team2Id : match.team1Id;
          await db
            .update(teams)
            .set({ eliminated: false })
            .where(eq(teams.id, previousLoserId));
        }
      }

      const winnerId = team1Score > team2Score ? match.team1Id : 
        team2Score > team1Score ? match.team2Id : 
        null;

      if (!winnerId) {
        return { error: 'Elimination matches cannot end in a draw' }
      }

      await db
        .update(matches)
        .set({
          team1Score,
          team2Score,
          winnerId,
          status: 'completed',
          updatedAt: new Date()
        })
        .where(eq(matches.id, matchId));

      await EliminationBracket.advanceWinner(matchId, winnerId);
      
      const remainingMatches = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.tournamentId, match.tournamentId),
            eq(matches.phase, 'elimination'),
            eq(matches.status, 'pending')
          )
        );

      if (remainingMatches.length === 0) {
        await db
          .update(tournaments)
          .set({ status: 'completed' })
          .where(eq(tournaments.id, match.tournamentId));
      }
    }

    // Invalidate tournament cache after any score update
    await invalidateTournamentCache(tournamentSlug)

    return { 
      success: true, 
      message: wasAlreadyCompleted ? 'Score updated' : 'Score reported',
      edited: wasAlreadyCompleted 
    }
  } catch (error) {
    console.error('Error updating match:', error);
    return { error: 'Internal server error' }
  }
}

export async function resetMatchAction(tournamentSlug: string, matchId: number) {
  // Verify admin authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return { error: 'Unauthorized' }
  }

  try {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));

    if (!match) {
      return { error: 'Match not found' }
    }

    if (match.phase === 'swiss' && match.status === 'completed' && 
        match.team1Score !== null && match.team2Score !== null &&
        match.team1Id && match.team2Id) 
    {
      await SwissSystem.reverseSwissStandings(
        match.team1Score,
        match.team2Score,
        match.team1Id,
        match.team2Id
      );
    }

    // Reset the match itself
    await db
      .update(matches)
      .set({
        team1Score: null,
        team2Score: null,
        winnerId: null,
        status: 'pending',
        updatedAt: new Date()
      })
      .where(eq(matches.id, match.id));

    // If it's an elimination match, handle bracket consequences
    if (match.phase === 'elimination' && match.winnerId) {
      // Remove winner from next match
      if (match.nextMatchId) {
        const [nextMatch] = await db
          .select()
          .from(matches)
          .where(eq(matches.id, match.nextMatchId));

        if (nextMatch) {
          if (nextMatch.team1Id === match.winnerId) {
            await db
              .update(matches)
              .set({ team1Id: null })
              .where(eq(matches.id, match.nextMatchId));
          } else if (nextMatch.team2Id === match.winnerId) {
            await db
              .update(matches)
              .set({ team2Id: null })
              .where(eq(matches.id, match.nextMatchId));
          }
        }
      }

      // Un-eliminate the loser
      const loserId = match.team1Id === match.winnerId ? match.team2Id : match.team1Id;
      if (loserId) {
        await db
          .update(teams)
          .set({ eliminated: false })
          .where(eq(teams.id, loserId));
      }
    }

    // Invalidate tournament cache after match reset
    await invalidateTournamentCache(tournamentSlug)

    return { success: true, message: 'Match reset successfully' }
  } catch (error) {
    console.error('Error resetting match:', error);
    return { error: 'Failed to reset match' }
  }
}