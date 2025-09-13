import { and, eq, or, desc } from 'drizzle-orm';
import { db, Team, Tournament } from '../db';
import { teams, tournaments, matches } from '../schema';
import { BuchholzCalculator } from '../buccholz-calculator';

interface PastMatch {
  id: number;
  roundNumber: number;
  phase: string;
  team1Score: number | null;
  team2Score: number | null;
  winnerId: number | null;
  status: string | null;
  opponent: Pick<Team, 'id' | 'name'> | null;
  isTeam1: boolean;
}

interface NextMatch {
  id: number;
  roundNumber: number;
  phase: string;
  opponent: Pick<Team, 'id' | 'name'> | null;
  tableNumber: number;
  turnNumber: number;
}

interface BuchholzDetails {
  medianBuchholzScore: number;
  opponentDetails: Array<{
    opponentId: number;
    opponentName: string;
    swissPoints: number;
    roundNumber: number;
    includedInCalculation: boolean;
    opponentBuchholzScore?: number;
  }>;
  totalOpponents: number;
  scoresUsed: number[];
  scoresExcluded: number[];
}

export interface TeamWithMatches extends Team {
  tournament: Pick<Tournament, 'name' | 'slug' | 'status'>;
  rank: number;
  pastMatches: PastMatch[];
  nextMatch: NextMatch | null;
  buchholzDetails: BuchholzDetails;
  opponentsBuchholzScore: number;
}

export async function getTeamDetailsAction(
  tournamentSlug: string,
  teamId: number
): Promise<{ team: TeamWithMatches | null; error?: string }> {
  try {
    // First verify the team belongs to this tournament
    const teamResult = await db
      .select({
        // Select all team fields
        id: teams.id,
        tournamentId: teams.tournamentId,
        name: teams.name,
        seed: teams.seed,
        swissPoints: teams.swissPoints,
        swissWins: teams.swissWins,
        swissDraws: teams.swissDraws,
        swissLosses: teams.swissLosses,
        swissGamePointsFor: teams.swissGamePointsFor,
        swissGamePointsAgainst: teams.swissGamePointsAgainst,
        qualifiedForElimination: teams.qualifiedForElimination,
        eliminated: teams.eliminated,
        createdAt: teams.createdAt,
        // Tournament info
        tournament: {
          name: tournaments.name,
          slug: tournaments.slug,
          status: tournaments.status,
        },
      })
      .from(teams)
      .innerJoin(tournaments, eq(teams.tournamentId, tournaments.id))
      .where(
        and(
          eq(teams.id, teamId),
          eq(tournaments.slug, tournamentSlug)
        )
      );

    if (teamResult.length === 0) {
      return { team: null, error: 'Team not found' };
    }

    const team = teamResult[0];
    if (!team.tournamentId) {
      return { team: null, error: 'Invalid tournament ID' };
    }

    // Get all teams for calculations (fetch once, use everywhere)
    const allTeams = await db.query.teams.findMany({
      where: eq(teams.tournamentId, team.tournamentId)
    });

    // Calculate detailed Buchholz information
    const buchholzDetails = await BuchholzCalculator.calculateDetailedMedianBuchholz(
      teamId, 
      team.tournamentId,
      allTeams // Pass teams to avoid re-fetching
    );

    // Calculate all Buchholz scores for ranking
    const teamBuchholzMap = await BuchholzCalculator.calculateAllBuchholzScores(team.tournamentId);
    const teamWithBuchholz = teamBuchholzMap.get(teamId);
    const opponentsBuchholzScore = teamWithBuchholz?.opponentsBuchholzScore || 0;

    // Get all matches for this team (past matches)
    const pastMatchesResult = await db
      .select({
        id: matches.id,
        roundNumber: matches.roundNumber,
        phase: matches.phase,
        team1Score: matches.team1Score,
        team2Score: matches.team2Score,
        winnerId: matches.winnerId,
        status: matches.status,
        team1Id: matches.team1Id,
        team2Id: matches.team2Id,
      })
      .from(matches)
      .where(
        and(
          or(
            eq(matches.team1Id, teamId),
            eq(matches.team2Id, teamId)
          ),
          eq(matches.status, 'completed')
        )
      )
      .orderBy(desc(matches.createdAt));

    // Batch fetch all opponent data
    const opponentIds = new Set<number>();
    pastMatchesResult.forEach(match => {
      const opponentId = match.team1Id === teamId ? match.team2Id : match.team1Id;
      if (opponentId) opponentIds.add(opponentId);
    });

    const opponentsData = opponentIds.size > 0 
      ? await db
          .select({ id: teams.id, name: teams.name })
          .from(teams)
          .where(or(...Array.from(opponentIds).map(id => eq(teams.id, id))))
      : [];
    
    const opponentsMap = new Map(opponentsData.map(o => [o.id, o]));

    // Process past matches
    const pastMatches: PastMatch[] = pastMatchesResult.map(match => {
      const isTeam1 = match.team1Id === teamId;
      const opponentId = isTeam1 ? match.team2Id : match.team1Id;
      const opponent = opponentId ? opponentsMap.get(opponentId) || null : null;

      return {
        id: match.id,
        roundNumber: match.roundNumber,
        phase: match.phase,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        winnerId: match.winnerId,
        status: match.status,
        opponent,
        isTeam1,
      };
    });

    // Get next match (pending match)
    const nextMatchResult = await db
      .select({
        id: matches.id,
        roundNumber: matches.roundNumber,
        phase: matches.phase,
        team1Id: matches.team1Id,
        team2Id: matches.team2Id,
        matchNumber: matches.matchNumber,
        bracketPosition: matches.bracketPosition,
      })
      .from(matches)
      .where(
        and(
          or(
            eq(matches.team1Id, teamId),
            eq(matches.team2Id, teamId)
          ),
          eq(matches.status, 'pending')
        )
      )
      .orderBy(matches.roundNumber, matches.matchNumber)
      .limit(1);

    let nextMatch: NextMatch | null = null;
    if (nextMatchResult.length > 0) {
      const match = nextMatchResult[0];
      const isTeam1 = match.team1Id === teamId;
      const opponentId = isTeam1 ? match.team2Id : match.team1Id;
      
      let opponent = null;
      if (opponentId) {
        const opponentResult = await db
          .select({ id: teams.id, name: teams.name })
          .from(teams)
          .where(eq(teams.id, opponentId));
        opponent = opponentResult[0] || null;
      }

      const AMOUNT_OF_TABLES = 25;
      let turnNumber = 0
      let tableNumber = 0

      if (match.phase=="elimination"){
        tableNumber = Number(match.bracketPosition?.match(/\d+$/)?.[0]) || 0;
      } else {
        turnNumber = Math.floor((match.matchNumber - 1) / AMOUNT_OF_TABLES) + 1;
        tableNumber = ((match.matchNumber - 1) % AMOUNT_OF_TABLES) + 1;
      }
    
      nextMatch = {
        id: match.id,
        roundNumber: match.roundNumber,
        phase: match.phase,
        opponent,
        tableNumber,
        turnNumber
      };
    }

    // Calculate rankings using the Buchholz map
    const standings = Array.from(teamBuchholzMap.values()).sort((a, b) => {
      // 1. Swiss Points
      if (a.swissPoints !== b.swissPoints) {
        return (b.swissPoints || 0) - (a.swissPoints || 0);
      }
      
      // 2. Cup Difference
      const aCupDiff = (a.swissGamePointsFor || 0) - (a.swissGamePointsAgainst || 0);
      const bCupDiff = (b.swissGamePointsFor || 0) - (b.swissGamePointsAgainst || 0);
      if (aCupDiff !== bCupDiff) {
        return bCupDiff - aCupDiff;
      }
      
      // 3. Median-Buchholz score
      if (a.buchholzScore !== b.buchholzScore) {
        return (b.buchholzScore || 0) - (a.buchholzScore || 0);
      }
      
      // 4. Opponents' Buchholz score
      return (b.opponentsBuchholzScore || 0) - (a.opponentsBuchholzScore || 0);
    });

    // Find the team's rank
    const rank = standings.findIndex(t => t.id === teamId) + 1;

    return {
      team: {
        ...team,
        rank,
        pastMatches,
        nextMatch,
        buchholzDetails,
        opponentsBuchholzScore,
      },
    };

  } catch (error) {
    console.error('Error fetching team details:', error);
    return { team: null, error: 'Failed to fetch team details' };
  }
}