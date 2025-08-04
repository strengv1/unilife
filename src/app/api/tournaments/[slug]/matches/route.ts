import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { matches, tournaments, teams } from '@/app/lib/schema';
import { eq, and, asc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { verifyAuth } from '@/app/lib/auth';
import { EliminationBracket, SwissSystem } from '@/app/lib/tournament-logic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const params = await context.params;

    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
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
    const matchList = await db
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

    return NextResponse.json(matchList);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
) {
  // Verify admin authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId, team1Score, team2Score, action } = body;

    // Get the match with tournament info
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    if (action === 'reset') {
      return await resetMatch(match);
    }
    if (!match.tournamentId) {
      return NextResponse.json({ error: 'Match has no tournament ID' }, { status: 400 });
    }
    if (!match.team1Id || !match.team2Id) {
      return NextResponse.json({ error: 'Match is missing teams' }, { status: 400 });
    }

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, match.tournamentId));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
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
          matchId, 
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
          return NextResponse.json({ 
            error: 'Cannot edit this match because subsequent matches have been played. Reset those matches first.' 
          }, { status: 400 });
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
        return NextResponse.json({ 
          error: 'Elimination matches cannot end in a draw' 
      }, { status: 400 });
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

    return NextResponse.json({ 
      success: true, 
      message: wasAlreadyCompleted ? 'Score updated' : 'Score reported',
      edited: wasAlreadyCompleted 
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function resetMatch(match: typeof matches.$inferSelect) {
  // TODO: Toimiiks matsin resettaus OIKEESTI oikein?
  // Muuttaako swiss standings jos tää tehää ekalle kierrokselle toisen tai kolmannen kierroksen aikana??
  //   -> Jos joo, pitäiskö estää?

  if (match.phase === 'swiss' && match.status === 'completed' && 
      match.team1Score !== null && match.team2Score !== null &&
      match.team1Id && match.team2Id) 
  {
    await SwissSystem.reverseSwissStandings(
      match.id,
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

  return NextResponse.json({ success: true, message: 'Match reset successfully' });
}
