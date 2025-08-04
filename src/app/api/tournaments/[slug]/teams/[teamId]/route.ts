import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { teams, tournaments } from '@/app/lib/schema';
import { verifyAuth } from '@/app/lib/auth';
import { and, eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; teamId: string }> }
) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;

    // First, find the tournament to get its ID
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Verify the team belongs to this tournament before deleting
    const [team] = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.id, parseInt(params.teamId)),
          eq(teams.tournamentId, tournament.id)
        )
      );

    if (!team) {
      return NextResponse.json({ error: 'Team not found in this tournament' }, { status: 404 });
    }

    // Now safe to delete
    await db
      .delete(teams)
      .where(
        and(
          eq(teams.id, parseInt(params.teamId)),
          eq(teams.tournamentId, tournament.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}