process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/tournament_test';

import { beforeAll, afterAll, beforeEach } from 'vitest'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'
// Import db AFTER setting environment variables so it uses test database
import { db } from '@/app/lib/db'

const TEST_DATABASE_URL = process.env.DATABASE_URL

// Use a global flag to ensure setup only runs once
const globalSetupKey = Symbol.for('test.database.setup')
const global = globalThis as any

beforeAll(async () => {
  // Check if setup has already been done by another test file
  if (global[globalSetupKey]) {
    console.log('Database already set up by another test file')
    return
  }
  
  console.log('Setting up test database with URL:', TEST_DATABASE_URL)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  
  // Create test database if it doesn't exist
  const setupConnection = postgres(
    'postgresql://postgres:postgres@localhost:5432/postgres', 
    { max: 1 }
  )
  
  try {
    await setupConnection`CREATE DATABASE tournament_test`
    console.log('Created tournament_test database')
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('tournament_test database already exists')
    } else {
      console.error('Error creating database:', e)
    }
  }
  await setupConnection.end()
  
  // Wait a bit for the db module to initialize
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Drop and recreate schema using the main db connection
  console.log('Creating tables...')
  try {
    // First try to drop if exists, ignore errors
    try {
      await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`)
    } catch (e) {
      console.log('Schema drop notice:', e)
    }
    
    // Create schema if it doesn't exist
    try {
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS public`)
    } catch (e) {
      // Schema might already exist from another test run
      console.log('Schema already exists, continuing...')
    }
    
    // Drop existing tables if they exist
    await db.execute(sql`DROP TABLE IF EXISTS matches CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS teams CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS tournaments CASCADE`)
    
    // Create tables
    await db.execute(sql`
      CREATE TABLE tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'registration',
        swiss_rounds INTEGER DEFAULT 6,
        elimination_teams INTEGER DEFAULT 32,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await db.execute(sql`
      CREATE TABLE teams (
        id SERIAL PRIMARY KEY,
        tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        seed INTEGER,
        swiss_points INTEGER DEFAULT 0,
        swiss_wins INTEGER DEFAULT 0,
        swiss_draws INTEGER DEFAULT 0,
        swiss_losses INTEGER DEFAULT 0,
        swiss_game_points_for INTEGER DEFAULT 0,
        swiss_game_points_against INTEGER DEFAULT 0,
        qualified_for_elimination BOOLEAN DEFAULT false,
        eliminated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await db.execute(sql`
      CREATE TABLE matches (
        id SERIAL PRIMARY KEY,
        tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
        round_number INTEGER NOT NULL,
        match_number INTEGER NOT NULL,
        phase VARCHAR(50) NOT NULL,
        team1_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        team2_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        team1_score INTEGER,
        team2_score INTEGER,
        winner_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        bracket_position VARCHAR(50),
        next_match_id INTEGER REFERENCES matches(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    // Mark setup as complete globally
    global[globalSetupKey] = true
    console.log('Test database setup complete')
  } catch (error) {
    console.error('Error setting up database schema:', error)
    throw error
  }
})

beforeEach(async () => {
  // Clear all data between tests
  try {
    await db.execute(sql`TRUNCATE tournaments, teams, matches RESTART IDENTITY CASCADE`)
  } catch (e) {
    // Tables might not exist yet if this is the first test
    console.log('Could not truncate tables:', e)
  }
})

afterAll(async () => {
  console.log('Test cleanup complete')
  // The connection will be closed when the process exits
})

// Export the test database URL for reference
export { TEST_DATABASE_URL }