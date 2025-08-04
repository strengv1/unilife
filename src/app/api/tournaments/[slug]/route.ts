import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { tournaments } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const body = await request.json();
    const { swissRounds, eliminationTeams } = body

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    if (tournament.status !== 'registration') {
      return NextResponse.json({ 
        error: 'Cannot modify tournament settings after it has started' 
      }, { status: 400 });
    }

    const [updated] = await db
      .update(tournaments)
      .set({
        swissRounds,
        eliminationTeams,
        updatedAt: new Date()
      })
      .where(eq(tournaments.id, tournament.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
  }
}
