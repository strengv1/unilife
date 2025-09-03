import * as schema from './schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type DatabaseType = PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

let db: DatabaseType;

async function initDb() {
  if (process.env.NODE_ENV === 'test') {
    // Test environment: Use postgres-js
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = (await import('postgres')).default;
    const client = postgres(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tournament_test');
    db = drizzle(client, { schema });
  } else if (process.env.NODE_ENV === 'production') {
    // Production: Use Neon
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzle(sql, { schema });
  } else {
    // Development: Use postgres-js
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = (await import('postgres')).default;
    const client = postgres(process.env.DATABASE_URL!);
    db = drizzle(client, { schema });
  }
}

await initDb();

export { db };

// Export types for use in your application
export type Tournament = typeof schema.tournaments.$inferSelect;
export type Team = typeof schema.teams.$inferSelect;
export type Match = typeof schema.matches.$inferSelect & {
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
};

export type TeamWithBuchholz = Team & {
  buchholzScore?: number;
  opponentsBuchholzScore?: number;
}

export type StandingWithPosition = TeamWithBuchholz & {
  position: number;
}

// Export insert types for creating new records
export type NewTournament = typeof schema.tournaments.$inferInsert;
export type NewTeam = typeof schema.teams.$inferInsert;
export type NewMatch = typeof schema.matches.$inferInsert;