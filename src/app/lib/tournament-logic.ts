import { and, asc, eq, inArray, or } from 'drizzle-orm';
import { db, NewMatch } from './db';
import { matches, teams } from './schema';
import { BuchholzCalculator } from './buccholz-calculator';

export class SwissSystem {
  static calculateSwissRounds(teamCount: number): number {
    return Math.ceil(Math.log2(teamCount));
  }

  static async generateSwissRound(tournamentId: number, roundNumber: number) {
    // Get teams with Buchholz scores for better pairing
    const teamBuchholzMap = await BuchholzCalculator.calculateAllBuchholzScores(tournamentId);
    const tournamentTeams = Array.from(teamBuchholzMap.values()).sort((a, b) => {
      // Sort by: 1. Points, 2. Goal Diff, 3. Buchholz, 4. Opponents' Buchholz
      if (a.swissPoints !== b.swissPoints) {
        return (b.swissPoints || 0) - (a.swissPoints || 0);
      }
      
      const aCupDiff = (a.swissGamePointsFor || 0) - (a.swissGamePointsAgainst || 0);
      const bCupDiff = (b.swissGamePointsFor || 0) - (b.swissGamePointsAgainst || 0);
      if (aCupDiff !== bCupDiff) {
        return bCupDiff - aCupDiff;
      }
      
      if (a.buchholzScore !== b.buchholzScore) {
        return (b.buchholzScore || 0) - (a.buchholzScore || 0);
      }
      
      return (b.opponentsBuchholzScore || 0) - (a.opponentsBuchholzScore || 0);
    });

    const roundMatches: NewMatch[] = [];
    const paired = new Set<number>();

    // Swiss pairing: match teams with similar points
    for (let i = 0; i < tournamentTeams.length; i++) {
      if (paired.has(tournamentTeams[i].id)) continue;

      for (let j = i + 1; j < tournamentTeams.length; j++) {
        if (paired.has(tournamentTeams[j].id)) continue;

        // Check if teams haven't played before
        const previousMatch = await db.query.matches.findFirst({
          where: and(
            eq(matches.tournamentId, tournamentId),
            or(
              and(eq(matches.team1Id, tournamentTeams[i].id), eq(matches.team2Id, tournamentTeams[j].id)),
              and(eq(matches.team1Id, tournamentTeams[j].id), eq(matches.team2Id, tournamentTeams[i].id))
            )
          )
        });

        if (!previousMatch) {
          roundMatches.push({
            tournamentId,
            roundNumber,
            matchNumber: roundMatches.length + 1,
            phase: 'swiss',
            team1Id: tournamentTeams[i].id,
            team2Id: tournamentTeams[j].id,
            status: 'pending',
            team1Score: null,
            team2Score: null,
            winnerId: null,
            bracketPosition: null,
            nextMatchId: null
          });
          paired.add(tournamentTeams[i].id);
          paired.add(tournamentTeams[j].id);
          break;
        }
      }
    }

    // Handle bye - give it to the lowest-ranked unpaired team
    const unpaired = tournamentTeams.find((team) => !paired.has(team.id));
    if (unpaired) {
      // Create a bye match (team vs null opponent, 0 cups)
      const byeMatch: NewMatch = {
        tournamentId,
        roundNumber,
        matchNumber: roundMatches.length + 1,
        phase: 'swiss',
        team1Id: unpaired.id,
        team2Id: null, // No opponent for bye
        team1Score: 0,
        team2Score: 0,
        winnerId: unpaired.id,
        status: 'completed', // Bye matches are automatically completed
        bracketPosition: null,
        nextMatchId: null
      };
      
      roundMatches.push(byeMatch);

      // Update team stats for the bye (Win with 0 cups)
      await db.update(teams)
        .set({ 
          swissPoints: (unpaired.swissPoints || 0) + 3,
          swissWins: (unpaired.swissWins || 0) + 1,
        })
        .where(eq(teams.id, unpaired.id));
    }

    // Insert matches
    if (roundMatches.length > 0) {
      await db.insert(matches).values(roundMatches);
    }
  }

  static async updateSwissStandings(matchId: number, team1Score: number, team2Score: number) {
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, matchId)
    });

    if (!match || !match.team1Id) throw new Error('Match not found or invalid');

    // Don't allow updating bye matches
    if (!match.team2Id) {
      throw new Error('Cannot update a bye match');
    }

    const [team1, team2] = await Promise.all([
      db.query.teams.findFirst({ where: eq(teams.id, match.team1Id) }),
      db.query.teams.findFirst({ where: eq(teams.id, match.team2Id) })
    ]);

    if (!team1 || !team2) throw new Error('Teams not found');

    const updates = [];

    if (team1Score > team2Score) {
      // Team 1 wins
      updates.push(
        db.update(teams).set({
          swissPoints: (team1.swissPoints || 0) + 3,
          swissWins: (team1.swissWins || 0) + 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) + team1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) + team2Score
        }).where(eq(teams.id, match.team1Id)),
        db.update(teams).set({
          swissLosses: (team2.swissLosses || 0) + 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) + team2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) + team1Score
        }).where(eq(teams.id, match.team2Id))
      );
    } else if (team2Score > team1Score) {
      // Team 2 wins
      updates.push(
        db.update(teams).set({
          swissLosses: (team1.swissLosses || 0) + 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) + team1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) + team2Score
        }).where(eq(teams.id, match.team1Id)),
        db.update(teams).set({
          swissPoints: (team2.swissPoints || 0) + 3,
          swissWins: (team2.swissWins || 0) + 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) + team2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) + team1Score
        }).where(eq(teams.id, match.team2Id))
      );
    } else {
      // Draw
      updates.push(
        db.update(teams).set({
          swissPoints: (team1.swissPoints || 0) + 1,
          swissDraws: (team1.swissDraws || 0) + 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) + team1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) + team2Score
        }).where(eq(teams.id, match.team1Id)),
        db.update(teams).set({
          swissPoints: (team2.swissPoints || 0) + 1,
          swissDraws: (team2.swissDraws || 0) + 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) + team2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) + team1Score
        }).where(eq(teams.id, match.team2Id))
      );
    }

    await Promise.all(updates);

    // Update match
    await db.update(matches).set({
      team1Score,
      team2Score,
      winnerId: team1Score > team2Score ? match.team1Id : (team2Score > team1Score ? match.team2Id : null),
      status: 'completed',
      updatedAt: new Date()
    }).where(eq(matches.id, matchId));
  }

  static async reverseSwissStandings(
    oldTeam1Score: number, 
    oldTeam2Score: number,
    team1Id: number,
    team2Id: number
  ) {
    // Don't allow reversing bye matches
    if (!team2Id) {
      throw new Error('Cannot reverse a bye match');
    }

    const [team1Data, team2Data] = await Promise.all([
      db.select().from(teams).where(eq(teams.id, team1Id)),
      db.select().from(teams).where(eq(teams.id, team2Id))
    ]);
  
    const team1 = team1Data[0];
    const team2 = team2Data[0];
  
    const updates = [];
  
    if (oldTeam1Score > oldTeam2Score) {
      // Team 1 was winner, reverse it
      updates.push(
        db.update(teams).set({
          swissPoints: (team1.swissPoints || 0) - 3,
          swissWins: (team1.swissWins || 0) - 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) - oldTeam1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) - oldTeam2Score
        }).where(eq(teams.id, team1Id)),
        db.update(teams).set({
          swissLosses: (team2.swissLosses || 0) - 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) - oldTeam2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) - oldTeam1Score
        }).where(eq(teams.id, team2Id))
      );
    } else if (oldTeam2Score > oldTeam1Score) {
      // Team 2 was winner, reverse it
      updates.push(
        db.update(teams).set({
          swissLosses: (team1.swissLosses || 0) - 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) - oldTeam1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) - oldTeam2Score
        }).where(eq(teams.id, team1Id)),
        db.update(teams).set({
          swissPoints: (team2.swissPoints || 0) - 3,
          swissWins: (team2.swissWins || 0) - 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) - oldTeam2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) - oldTeam1Score
        }).where(eq(teams.id, team2Id))
      );
    } else {
      // It was a draw, reverse it
      updates.push(
        db.update(teams).set({
          swissPoints: (team1.swissPoints || 0) - 1,
          swissDraws: (team1.swissDraws || 0) - 1,
          swissGamePointsFor: (team1.swissGamePointsFor || 0) - oldTeam1Score,
          swissGamePointsAgainst: (team1.swissGamePointsAgainst || 0) - oldTeam2Score
        }).where(eq(teams.id, team1Id)),
        db.update(teams).set({
          swissPoints: (team2.swissPoints || 0) - 1,
          swissDraws: (team2.swissDraws || 0) - 1,
          swissGamePointsFor: (team2.swissGamePointsFor || 0) - oldTeam2Score,
          swissGamePointsAgainst: (team2.swissGamePointsAgainst || 0) - oldTeam1Score
        }).where(eq(teams.id, team2Id))
      );
    }
  
    await Promise.all(updates);
  }

  static async qualifyForElimination(tournamentId: number, topN: number = 32) {
    // Calculate Buchholz scores for all teams
    const teamBuchholzMap = await BuchholzCalculator.calculateAllBuchholzScores(tournamentId);
    
    // Sort teams with complete tie-breaking
    const standings = Array.from(teamBuchholzMap.values()).sort((a, b) => {
      // 1. Swiss points
      if (a.swissPoints !== b.swissPoints) {
        return (b.swissPoints || 0) - (a.swissPoints || 0);
      }
      
      // 2. Cup difference
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
    }).slice(0, topN);

    // Mark qualified teams
    await db.update(teams)
      .set({ qualifiedForElimination: true })
      .where(and(
        eq(teams.tournamentId, tournamentId),
        inArray(teams.id, standings.map(t => t.id))
      ));

    // Seed teams for elimination
    for (let i = 0; i < standings.length; i++) {
      await db.update(teams)
        .set({ seed: i + 1 })
        .where(eq(teams.id, standings[i].id));
    }
  }

  /**
   * Get current Swiss standings with Buchholz scores
   */
  static async getStandings(tournamentId: number) {
    const teamBuchholzMap = await BuchholzCalculator.calculateAllBuchholzScores(tournamentId);
    
    return Array.from(teamBuchholzMap.values()).sort((a, b) => {
      // 1. Swiss points
      if (a.swissPoints !== b.swissPoints) {
        return (b.swissPoints || 0) - (a.swissPoints || 0);
      }
      
      // 2. Goal difference
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
  }

  /**
   * Helper method to check if a match is a bye match
   */
  static isByeMatch(match: { team1Id: number | null; team2Id: number | null }): boolean {
    return match.team1Id !== null && match.team2Id === null;
  }
}

export class EliminationBracket {
  static generateSeedingMap(numPlayers: number) {
    function nextLayer(prevLayer: Array<number>) {
      const nextLayer: Array<number> = [];
      const length = prevLayer.length * 2 + 1;
      prevLayer.forEach(function (d) {
        nextLayer.push(d);
        nextLayer.push(length - d);
      });
      return nextLayer;
    }
  
    const rounds = Math.log(numPlayers) / Math.log(2) - 1;
    let seedToBracketPosition = [1, 2];
    for (let i = 0; i < rounds; i++) {
      seedToBracketPosition = nextLayer(seedToBracketPosition);
    }

    return seedToBracketPosition
      .splice(0, (seedToBracketPosition.length/2))
      .concat(seedToBracketPosition.reverse());
  }

  static async generateBracket(tournamentId: number) {
    const qualifiedTeams = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.tournamentId, tournamentId),
          eq(teams.qualifiedForElimination, true)
        )
      )
      .orderBy(asc(teams.seed));
  
    const rounds = Math.ceil(Math.log2(qualifiedTeams.length));
  
    // Create all matches first
    const allMatches: NewMatch[] = [];
    let matchCounter = 1;
      
    const seedingMap = EliminationBracket.generateSeedingMap(qualifiedTeams.length);
    const teamsOrdered = seedingMap.map(seed => qualifiedTeams[seed - 1]);
    
    // Generate matches round by round
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round);
      
      for (let i = 0; i < matchesInRound; i++) {
        const match: NewMatch = {
          tournamentId,
          roundNumber: round,
          matchNumber: matchCounter++,
          phase: 'elimination',
          bracketPosition: `R${round}M${i + 1}`,
          status: 'pending',
          team1Id: null,
          team2Id: null,
          team1Score: null,
          team2Score: null,
          winnerId: null,
          nextMatchId: null,
        };
  
        // For first round, assign teams based on seeding
        if (round === 1) {
          if (teamsOrdered[i*2]) match.team1Id = teamsOrdered[i*2].id;
          if (teamsOrdered[i*2 + 1]) match.team2Id = teamsOrdered[i*2 + 1].id;
  
          // Auto-complete if it's a bye
          if (match.team1Id && !match.team2Id) {
            match.status = 'completed';
            match.winnerId = match.team1Id;
          } else if (!match.team1Id && match.team2Id) {
            match.status = 'completed';
            match.winnerId = match.team2Id;
          }
        }
  
        allMatches.push(match);
      }
    }
  
    // Insert all matches
    const insertedMatches = await db
      .insert(matches)
      .values(allMatches)
      .returning();
  
    // Now update nextMatchId references
    const updates = [];
    
    for (let round = 1; round < rounds; round++) {
      const currentRoundMatches = insertedMatches.filter(m => m.roundNumber === round);
      const nextRoundMatches = insertedMatches.filter(m => m.roundNumber === round + 1);
      
      for (let i = 0; i < currentRoundMatches.length; i++) {
        const nextMatchIndex = Math.floor(i / 2);
        if (nextMatchIndex < nextRoundMatches.length) {
          updates.push(
            db
              .update(matches)
              .set({ nextMatchId: nextRoundMatches[nextMatchIndex].id })
              .where(eq(matches.id, currentRoundMatches[i].id))
          );
        }
      }
    }
  
    await Promise.all(updates);
  
    // Auto-advance any byes
    const firstRoundMatches = insertedMatches.filter(m => m.roundNumber === 1 && m.status === 'completed');
    for (const match of firstRoundMatches) {
      if (match.winnerId) {
        await EliminationBracket.advanceWinner(match.id, match.winnerId);
      }
    }
  }

  static async advanceWinner(matchId: number, winnerId: number) {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));
  
    if (!match) throw new Error('Match not found');

    // If match is missing teams but is completed, it was won with BYE
    if ((!match.team1Id || !match.team2Id) && match.status !== "completed") throw new Error('Match missing teams');
  
    // Update current match
    await db
      .update(matches)
      .set({
        winnerId,
        status: 'completed',
        updatedAt: new Date()
      })
      .where(eq(matches.id, matchId));
  
    // Advance to next match
    if (match.nextMatchId) {
      const [nextMatch] = await db
        .select()
        .from(matches)
        .where(eq(matches.id, match.nextMatchId));
  
      if (nextMatch) {
        // Get all matches that feed into this next match
        const feederMatches = await db
          .select()
          .from(matches)
          .where(eq(matches.nextMatchId, match.nextMatchId))
          .orderBy(asc(matches.matchNumber));
  
        // Determine position based on which feeder match this is
        const feederIndex = feederMatches.findIndex(m => m.id === match.id);
        
        if (feederIndex === 0) {
          // First feeder match winner goes to team1
          await db
            .update(matches)
            .set({ team1Id: winnerId })
            .where(eq(matches.id, match.nextMatchId));
        } else if (feederIndex === 1) {
          // Second feeder match winner goes to team2
          await db
            .update(matches)
            .set({ team2Id: winnerId })
            .where(eq(matches.id, match.nextMatchId));
        }
      }
    }
  
    // Mark loser as eliminated, if this wasnt a bye
    const loserId = match.team1Id === winnerId ? match.team2Id : match.team1Id;
    if(!loserId) return;

    await db
      .update(teams)
      .set({ eliminated: true })
      .where(eq(teams.id, loserId));
  }
}