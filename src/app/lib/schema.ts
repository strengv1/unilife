import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, integer, boolean, timestamp, text, AnyPgColumn } from 'drizzle-orm/pg-core';

export const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('registration'),
  swissRounds: integer('swiss_rounds').default(6),
  eliminationTeams: integer('elimination_teams').default(32),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id),
  name: varchar('name', { length: 255 }).notNull(),
  seed: integer('seed'),
  swissPoints: integer('swiss_points').default(0),
  swissWins: integer('swiss_wins').default(0),
  swissDraws: integer('swiss_draws').default(0),
  swissLosses: integer('swiss_losses').default(0),
  swissGamePointsFor: integer('swiss_game_points_for').default(0),
  swissGamePointsAgainst: integer('swiss_game_points_against').default(0),
  qualifiedForElimination: boolean('qualified_for_elimination').default(false),
  eliminated: boolean('eliminated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id),
  roundNumber: integer('round_number').notNull(),
  matchNumber: integer('match_number').notNull(),
  phase: varchar('phase', { length: 50 }).notNull(),
  team1Id: integer('team1_id').references(() => teams.id),
  team2Id: integer('team2_id').references(() => teams.id),
  team1Score: integer('team1_score'),
  team2Score: integer('team2_score'),
  winnerId: integer('winner_id').references(() => teams.id),
  status: varchar('status', { length: 50 }).default('pending'),
  bracketPosition: varchar('bracket_position', { length: 50 }),
  nextMatchId: integer('next_match_id').references((): AnyPgColumn => matches.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


export const matchRelations = relations(matches, ({ one }) => ({
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
    relationName: 'team1',
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
    relationName: 'team2',
  }),
  winner: one(teams, {
    fields: [matches.winnerId],
    references: [teams.id],
    relationName: 'winner',
  }),
}));
