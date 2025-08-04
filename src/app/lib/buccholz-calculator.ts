
import { and, eq, or, ne } from 'drizzle-orm';
import { db, TeamWithBuchholz } from './db';
import { matches, teams } from './schema';

interface OpponentRecord {
  opponentId: number;
  roundNumber: number;
}

export class BuchholzCalculator {
  /**
   * For Buchholz calculation, we can use Swiss points directly (3 - 1 - 0)
   * instead of the traditional system (1 - 0.5 - 0) for simplicity
   */

  /**
   * Get all opponents a team has played against
   */
  static async getTeamOpponents(teamId: number, tournamentId: number): Promise<OpponentRecord[]> {
    const teamMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.phase, 'swiss'),
        ne(matches.status, 'pending'),
        or(
          eq(matches.team1Id, teamId),
          eq(matches.team2Id, teamId)
        )
      )
    });

    return teamMatches
      .filter(match => match.team1Id && match.team2Id) // Exclude byes
      .map(match => ({
        opponentId: match.team1Id === teamId ? match.team2Id! : match.team1Id!,
        roundNumber: match.roundNumber
      }));
  }

  /**
   * Calculate Median-Buchholz score for a team
   * @param teamId The team to calculate for
   * @param tournamentId The tournament ID
   * @param allTeams All teams in the tournament (to avoid repeated queries)
   */
  static async calculateMedianBuchholz(
    teamId: number, 
    tournamentId: number,
    allTeams?: TeamWithBuchholz[]
  ): Promise<number> {
    // Get all teams if not provided
    if (!allTeams) {
      allTeams = await db.query.teams.findMany({
        where: eq(teams.tournamentId, tournamentId)
      });
    }

    // Get opponents
    const opponents = await this.getTeamOpponents(teamId, tournamentId);
    
    if (opponents.length === 0) return 0;

    // Get Swiss points of all opponents (using Swiss points directly)
    const opponentScores = opponents
      .map(opp => {
        const oppTeam = allTeams.find(t => t.id === opp.opponentId);
        return oppTeam ? (oppTeam.swissPoints || 0) : 0;
      })
      .sort((a, b) => a - b); // Sort ascending

    // Apply Median-Buchholz: remove best and worst scores if we have 3+ opponents
    let scoresForCalculation = opponentScores;
    if (opponentScores.length >= 3) {
      scoresForCalculation = opponentScores.slice(1, -1); // Remove first (worst) and last (best)
    }

    // Sum the remaining scores
    return scoresForCalculation.reduce((sum, score) => sum + score, 0);
  }

  /**
   * Calculate Opponents' Buchholz score (sum of all opponents' Buchholz scores)
   */
  static async calculateOpponentsBuchholz(
    teamId: number,
    tournamentId: number,
    teamBuchholzScores: Map<number, number>
  ): Promise<number> {
    const opponents = await this.getTeamOpponents(teamId, tournamentId);
    
    return opponents.reduce((sum, opp) => {
      return sum + (teamBuchholzScores.get(opp.opponentId) || 0);
    }, 0);
  }

  /**
   * Calculate all Buchholz scores for teams in a tournament
   */
  static async calculateAllBuchholzScores(tournamentId: number): Promise<Map<number, TeamWithBuchholz>> {
    // Get all teams
    const allTeams = await db.query.teams.findMany({
      where: eq(teams.tournamentId, tournamentId)
    });

    // Calculate Buchholz scores for all teams
    const teamBuchholzMap = new Map<number, number>();
    for (const team of allTeams) {
      const buchholz = await this.calculateMedianBuchholz(team.id, tournamentId, allTeams);
      teamBuchholzMap.set(team.id, buchholz);
    }

    // Calculate Opponents' Buchholz scores
    const result = new Map<number, TeamWithBuchholz>();
    for (const team of allTeams) {
      const opponentsBuchholz = await this.calculateOpponentsBuchholz(team.id, tournamentId, teamBuchholzMap);
      result.set(team.id, {
        ...team,
        buchholzScore: teamBuchholzMap.get(team.id) || 0,
        opponentsBuchholzScore: opponentsBuchholz
      });
    }

    return result;
  }
}
