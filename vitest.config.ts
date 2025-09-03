import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.test before Vitest starts
dotenv.config({ path: '.env.test' })

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
