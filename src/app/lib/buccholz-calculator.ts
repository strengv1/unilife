import { and, eq, ne } from 'drizzle-orm';
import { db, Team, TeamWithBuchholz } from './db';
import { matches, teams } from './schema';

interface OpponentRecord {
  opponentId: number;
  roundNumber: number;
}

interface OpponentScoreDetail {
  opponentId: number;
  opponentName: string;
  swissPoints: number;
  roundNumber: number;
  includedInCalculation: boolean;
  opponentBuchholzScore?: number;
}

interface DetailedBuchholzResult {
  medianBuchholzScore: number;
  opponentDetails: OpponentScoreDetail[];
  totalOpponents: number;
  scoresUsed: number[];
  scoresExcluded: number[];
}

export class BuchholzCalculator {
  private static teamOpponentsCache = new Map<string, OpponentRecord[]>();
  private static matchesCache = new Map<number, any[]>();
  
  /**
   * Clear all caches - call this when matches are updated
   */
  static clearCache() {
    this.teamOpponentsCache.clear();
    this.matchesCache.clear();
  }
  
  /**
   * Get all completed matches for a tournament (with caching)
   */
  private static async getTournamentMatches(tournamentId: number) {
    if (this.matchesCache.has(tournamentId)) {
      return this.matchesCache.get(tournamentId)!;
    }
    
    const allMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.phase, 'swiss'),
        ne(matches.status, 'pending')
      )
    });
    
    this.matchesCache.set(tournamentId, allMatches);
    return allMatches;
  }
  
  /**
   * Get all opponents a team has played against (with caching)
   */
  static async getTeamOpponents(teamId: number, tournamentId: number): Promise<OpponentRecord[]> {
    const cacheKey = `${tournamentId}-${teamId}`;
    
    if (this.teamOpponentsCache.has(cacheKey)) {
      return this.teamOpponentsCache.get(cacheKey)!;
    }
    
    const allMatches = await this.getTournamentMatches(tournamentId);
    
    const teamMatches = allMatches.filter(match => 
      match.team1Id === teamId || match.team2Id === teamId
    );
    
    const opponents = teamMatches
      // .filter(match => match.team1Id && match.team2Id) // Exclude byes
      .map(match => ({
        opponentId: match.team1Id === teamId ? match.team2Id! : match.team1Id!,
        roundNumber: match.roundNumber
      }));
    
    this.teamOpponentsCache.set(cacheKey, opponents);
    return opponents;
  }

  /**
   * Calculate simple Median-Buchholz score (sum of opponents' Swiss points with median rule)
   * This version doesn't calculate opponents' opponents to avoid recursion
   */
  private static calculateSimpleMedianBuchholz(
    opponents: OpponentRecord[],
    allTeams: Team[]
  ): number {
    if (opponents.length === 0) return 0;
    
    // Get opponent Swiss points
    const opponentPoints = opponents.map(opp => {
      const oppTeam = allTeams.find(t => t.id === opp.opponentId);
      return oppTeam ? (oppTeam.swissPoints || 0) : 0;
    });
    
    // Sort for median calculation
    const sortedPoints = [...opponentPoints].sort((a, b) => a - b);
    
    // Apply Median-Buchholz rule: remove best and worst if we have 3+ opponents
    if (sortedPoints.length >= 3) {
      // Remove first (worst) and last (best)
      return sortedPoints.slice(1, -1).reduce((sum, points) => sum + points, 0);
    } else {
      // Use all scores if less than 3 opponents
      return sortedPoints.reduce((sum, points) => sum + points, 0);
    }
  }

  /**
   * Calculate detailed Median-Buchholz with breakdown for display
   */
  static async calculateDetailedMedianBuchholz(
    teamId: number,
    tournamentId: number,
    allTeams?: Team[]
  ): Promise<DetailedBuchholzResult> {
    // Get all teams if not provided
    if (!allTeams) {
      allTeams = await db.query.teams.findMany({
        where: eq(teams.tournamentId, tournamentId)
      });
    }
  
    // Get opponents for this team
    const opponents = await this.getTeamOpponents(teamId, tournamentId);
   
    if (opponents.length === 0) {
      return {
        medianBuchholzScore: 0,
        opponentDetails: [],
        totalOpponents: 0,
        scoresUsed: [],
        scoresExcluded: []
      };
    }
  
    // Pre-calculate all opponents for all teams to avoid repeated queries
    const allTeamOpponents = new Map<number, OpponentRecord[]>();
    for (const team of allTeams) {
      const teamOpponents = await this.getTeamOpponents(team.id, tournamentId);
      allTeamOpponents.set(team.id, teamOpponents);
    }
    
    // Calculate simple MB for all teams (no recursion)
    const teamBuchholzMap = new Map<number, number>();
    for (const team of allTeams) {
      const teamOpponents = allTeamOpponents.get(team.id) || [];
      const buchholz = this.calculateSimpleMedianBuchholz(teamOpponents, allTeams);
      teamBuchholzMap.set(team.id, buchholz);
    }
    // Build detailed opponent information
    const opponentDetails: OpponentScoreDetail[] = opponents.map(opp => {
      const oppTeam = allTeams.find(t => t.id === opp.opponentId);
      return {
        opponentId: opp.opponentId,
        opponentName: oppTeam?.name || 'BYE',
        swissPoints: oppTeam ? (oppTeam.swissPoints || 0) : 0,
        roundNumber: opp.roundNumber,
        includedInCalculation: false, // Will be updated below
        opponentBuchholzScore: teamBuchholzMap.get(opp.opponentId) || 0
      };
    });
  
    // Sort by swiss points for median calculation
    const sortedDetails = [...opponentDetails].sort((a, b) => a.swissPoints - b.swissPoints);
    
    // Apply Median-Buchholz: remove best and worst scores if we have 3+ opponents
    let scoresUsed: number[] = [];
    let scoresExcluded: number[] = [];
    
    if (sortedDetails.length >= 3) {
      // Exclude first (worst) and last (best)
      scoresExcluded = [sortedDetails[0].swissPoints, sortedDetails[sortedDetails.length - 1].swissPoints];
      scoresUsed = sortedDetails.slice(1, -1).map(d => d.swissPoints);
      
      // Mark which opponents are included in calculation
      const usedOpponentIds = new Set(sortedDetails.slice(1, -1).map(d => d.opponentId));
      opponentDetails.forEach(detail => {
        detail.includedInCalculation = usedOpponentIds.has(detail.opponentId);
      });
    } else {
      // Use all scores if less than 3 opponents
      scoresUsed = sortedDetails.map(d => d.swissPoints);
      opponentDetails.forEach(detail => {
        detail.includedInCalculation = true;
      });
    }
  
    const medianBuchholzScore = scoresUsed.reduce((sum, score) => sum + score, 0);
  
    return {
      medianBuchholzScore,
      opponentDetails: opponentDetails.sort((a, b) => a.roundNumber - b.roundNumber), // Sort by round for display
      totalOpponents: opponents.length,
      scoresUsed,
      scoresExcluded
    };
  }

  /**
   * Calculate Median-Buchholz score for a team (simplified version)
   */
  static async calculateMedianBuchholz(
    teamId: number,
    tournamentId: number,
    allTeams?: Team[]
  ): Promise<number> {
    if (!allTeams) {
      allTeams = await db.query.teams.findMany({
        where: eq(teams.tournamentId, tournamentId)
      });
    }
    
    const opponents = await this.getTeamOpponents(teamId, tournamentId);
    return this.calculateSimpleMedianBuchholz(opponents, allTeams);
  }

  /**
   * Calculate Opponents' Buchholz score (sum of all opponents' MB scores)
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
   * This is the main entry point for bulk calculations
   */
  static async calculateAllBuchholzScores(tournamentId: number): Promise<Map<number, TeamWithBuchholz>> {
    // Clear cache for fresh calculations
    this.clearCache();
    
    // Get all teams
    const allTeams = await db.query.teams.findMany({
      where: eq(teams.tournamentId, tournamentId)
    });

    // Pre-fetch all opponents for all teams
    const allTeamOpponents = new Map<number, OpponentRecord[]>();
    for (const team of allTeams) {
      const opponents = await this.getTeamOpponents(team.id, tournamentId);
      allTeamOpponents.set(team.id, opponents);
    }

    // Calculate MB scores for all teams (non-recursive)
    const teamBuchholzMap = new Map<number, number>();
    for (const team of allTeams) {
      const opponents = allTeamOpponents.get(team.id) || [];
      const buchholz = this.calculateSimpleMedianBuchholz(opponents, allTeams);
      teamBuchholzMap.set(team.id, buchholz);
    }

    // Calculate Opponents' MB scores
    const result = new Map<number, TeamWithBuchholz>();
    for (const team of allTeams) {
      const opponents = allTeamOpponents.get(team.id) || [];
      const opponentsBuchholz = opponents.reduce((sum, opp) => {
        return sum + (teamBuchholzMap.get(opp.opponentId) || 0);
      }, 0);
      
      result.set(team.id, {
        ...team,
        buchholzScore: teamBuchholzMap.get(team.id) || 0,
        opponentsBuchholzScore: opponentsBuchholz
      });
    }

    return result;
  }

  /**
   * Helper to check if Median-Buchholz rule applies
   * (useful for UI to show when exclusion happens)
   */
  static isMedianRuleApplied(opponentCount: number): boolean {
    return opponentCount >= 3;
  }
}