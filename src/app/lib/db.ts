import * as schema from './schema';

let db: any;

if (process.env.NODE_ENV === 'production') {
  // Production: Use Neon
  const { neon } = require('@neondatabase/serverless');
  const { drizzle } = require('drizzle-orm/neon-http');
  
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzle(sql, { schema });
} else {
  // Development: Use regular PostgreSQL
  const { drizzle } = require('drizzle-orm/postgres-js');
  const postgres = require('postgres');
  
  const client = postgres(process.env.DATABASE_URL!);
  db = drizzle(client, { schema });
}

// Export with proper typing
export { db };


// Export types for use in your application
export type Tournament = typeof schema.tournaments.$inferSelect;
export type Team = typeof schema.teams.$inferSelect;
export type Match = typeof schema.matches.$inferSelect& {
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
};

export type TeamWithBuchholz = Team & {
  buchholzScore?: number;
  opponentsBuchholzScore?: number;
}

// Export insert types for creating new records
export type NewTournament = typeof schema.tournaments.$inferInsert;
export type NewTeam = typeof schema.teams.$inferInsert;
export type NewMatch = typeof schema.matches.$inferInsert;
