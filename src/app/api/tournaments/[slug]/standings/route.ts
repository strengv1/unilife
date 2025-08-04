import { NextRequest, NextResponse } from 'next/server';
import { SwissSystem } from '@/app/lib/tournament-logic';
import { db } from '@/app/lib/db';
import { tournaments } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));
    
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    const standings = await SwissSystem.getStandings(tournament.id);
    
    // Add position for each team
    const standingsWithPosition = standings.map((team, index) => ({
      ...team,
      position: index + 1
    }));

    return NextResponse.json(standingsWithPosition);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}