import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { tournaments } from '@/app/lib/schema';
import { verifyAuth } from '@/app/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const tournamentList = await db
      .select()
      .from(tournaments)
      .orderBy(desc(tournaments.createdAt));

    return NextResponse.json(tournamentList);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, type, swissRounds, eliminationTeams } = body;

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

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error creating tournaments:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}