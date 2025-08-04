import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { tournaments, teams } from '@/app/lib/schema';
import { verifyAuth } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';
import { SwissSystem } from '@/app/lib/tournament-logic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const slug = params.slug

    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    if (tournament.status !== 'registration') {
      return NextResponse.json({ error: 'Tournament already started' }, { status: 400 });
    }

    // Get all teams
    const teamList = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    if (teamList.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 teams to start' }, { status: 400 });
    }

    // Update tournament status
    await db
      .update(tournaments)
      .set({ status: 'swiss' })
      .where(eq(tournaments.id, tournament.id));

    // Generate first Swiss round
    await SwissSystem.generateSwissRound(tournament.id, 1);

    return NextResponse.json({ success: true, message: 'Tournament started' });
  } catch (error) {
    console.error('Error starting tournament:', error);
    return NextResponse.json({ error: 'Failed to start tournament' }, { status: 500 });
  }
}