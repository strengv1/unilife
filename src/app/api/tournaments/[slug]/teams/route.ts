import { NextRequest, NextResponse } from 'next/server';
import { db, Team } from '@/app/lib/db';
import { teams, tournaments } from '@/app/lib/schema';
import { verifyAuth } from '@/app/lib/auth';
import { eq, and } from 'drizzle-orm';

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

    // Get teams
    const teamList = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    return NextResponse.json(teamList);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const body = await request.json();
    const { name } = body;

    // Validate team name
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Check for duplicate team name in this tournament
    const existingTeam = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.tournamentId, tournament.id),
          eq(teams.name, trimmedName)
        )
      );

    if (existingTeam.length > 0) {
      return NextResponse.json({ 
        error: 'A team with this name already exists in the tournament' 
      }, { status: 409 }); // 409 Conflict
    }

    // Add team
    const [team] = await db
      .insert(teams)
      .values({
        tournamentId: tournament.id,
        name: trimmedName,
      })
      .returning();

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error adding team:', error);
    return NextResponse.json({ error: 'Failed to add team' }, { status: 500 });
  }
}

interface ValidationItem {
  name: string;
  isValid: boolean;
  error: string | null;
}

export async function PUT(
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
    const { names, action } = body;

    if (action !== 'validate') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Find tournament
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.slug, params.slug));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Get existing teams
    const existingTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournament.id));

    const existingNames = new Set(existingTeams.map((t: Team) => t.name.toLowerCase()));

    // Check for duplicates
    const validation: ValidationItem[] = names.map((name: string) => {
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
    names.forEach((name: string) => {
      const lower = name.trim().toLowerCase();
      nameCount.set(lower, (nameCount.get(lower) || 0) + 1);
    });

    validation.forEach((item: ValidationItem) => {
      if (item.isValid && nameCount.get(item.name.toLowerCase())! > 1) {
        item.isValid = false;
        item.error = 'Duplicate in list';
      }
    });

    return NextResponse.json({ validation });
  } catch (error) {
    console.error('Error validating teams:', error);
    return NextResponse.json({ error: 'Failed to validate teams' }, { status: 500 });
  }
}