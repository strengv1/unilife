import * as schema from './schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type DatabaseType = PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

let db: DatabaseType;

if (process.env.NODE_ENV === 'production') {
  // Production: Use Neon
  import('@neondatabase/serverless').then(({ neon }) => {
    import('drizzle-orm/neon-http').then(({ drizzle }) => {
      const sql = neon(process.env.DATABASE_URL!);
      db = drizzle(sql, { schema });
    });
  });
} else {
  // Development: Use regular PostgreSQL
  import('drizzle-orm/postgres-js').then(({ drizzle }) => {
    import('postgres').then(({ default: postgres }) => {
      const client = postgres(process.env.DATABASE_URL!);
      db = drizzle(client, { schema });
    });
  });
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
export type StandingWithPosition = TeamWithBuchholz & {
  position: number;
}

// Export insert types for creating new records
export type NewTournament = typeof schema.tournaments.$inferInsert;
export type NewTeam = typeof schema.teams.$inferInsert;
export type NewMatch = typeof schema.matches.$inferInsert;
