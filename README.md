# UNI LIFE Tournament System

Homepage for UNI LIFE, with a serverless tournament management system for organizing Swiss-system and elimination tournaments. Built for occasional use (2-3 times per year) with cost-efficiency in mind.

## Quick Links

- **Production Site**: https://unilife.fi
- **Admin Panel**: https://unilife.fi/admin
- **Vercel Dashboard**: https://vercel.com/villes-97-hotmailcoms-projects/unilife
- **Neon Database Console**: https://console.neon.tech/app/projects/misty-breeze-05142636?branchId=br-round-violet-a2z56wet

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions (Serverless Functions)
- **Database**: 
  - Production: Neon (Serverless PostgreSQL)
  - Development: Docker PostgreSQL
- **ORM**: Drizzle ORM
- **Hosting**: Vercel (Serverless)
- **Authentication**: JWT with httpOnly cookies

## Architecture Decisions

1. **Serverless**: Perfect for infrequent use
2. **Neon**: Working free tier
3. **No WebSockets**: Refresh-based updates sufficient
4. **Simple Auth**: JWT in httpOnly cookies

## Project Structure

- `/src/app/admin/` - Admin dashboard and tournament management
- `/src/app/events/[slug]/bracket/` - Public bracket views
- `/src/app/events/[slug]/bracket/admin/` - Score reporting interface
- `/src/app/components/` - Reusable React components
- `/src/lib/` - Core logic (database, auth, tournament algorithms)
- `/docker-compose.yml` - Local PostgreSQL setup

## Development Setup

### Prerequisites
- Node.js 18+
- Docker Desktop (for local database)
- Git

### Initial Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/your-username/unilife
cd unilife
npm install
```

2. Start local database:
```bash
docker-compose up --build -d
```

3. Set up environment variables:
```bash
# Create .env.local file with:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tournament_dev"
ADMIN_PASSWORD="your-dev-password"
JWT_SECRET="your-dev-jwt-secret"
```

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

## Common Tasks

### Running tests

For now, tests only work when run one at a time, working on a solution to this!

```bash
npx vitest run __tests__/unit/
npx vitest run __tests__/integration/swiss-system.test.ts
npx vitest run __tests__/integration/buchholz.test.ts
npx vitest run __tests__/integration/team-actions.test.ts
npx vitest run __tests__/integration/tournament-actions.test.ts
```

### Managing Tournaments

1. **Access admin panel**: http://localhost:3000/admin
2. **Create tournament**:
   - Click "Create New"
   - Set Swiss rounds (recommended: ceil(log2(team_count)))
   - Add teams
   - Click "Start Tournament" to generate first round

3. **Report scores**:
   - Go to `/events/[tournament-slug]/bracket/admin`
   - Select match
   - Enter scores
   - System auto-advances winners and generates next rounds

### Database Operations

View Database Locally:
```bash
npm run db:studio
```

Reset Local Database:
```bash
npm run docker:reset
npm run db:push
```

Access Production Database:
- Go to Neon Console
- Select your project
- Use SQL Editor for queries

### Deployment

Deploy to Production:
- Vercel auto-deploys on push to main branch

Update Production Schema (Windows):
```powershell
copy .env.local .env.local.backup
copy .env.production.local .env.local
npx drizzle-kit push
copy .env.local.backup .env.local
del .env.local.backup
```

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_PASSWORD` - Admin panel password (keep secret!)
- `JWT_SECRET` - JWT signing secret (keep secret!)
- `NODE_ENV` - Environment (development/production)

## Cost Management

### Current Setup (Free)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Neon**: Free tier (0.5GB storage, auto-suspends)
- **Annual cost**: $0-5

### Off-Season
Database auto-suspends after 5 minutes of inactivity. No action needed!

## Troubleshooting

### "Cannot connect to database"
- Check Docker is running: `docker ps`
- Verify DATABASE_URL in `.env.local`
- Restart Docker: `npm run docker:reset`

### "Schema out of sync"
```bash
npm run db:push
```

### "Admin login not working"
- Check ADMIN_PASSWORD in environment
- Clear browser cookies
- Verify JWT_SECRET is set

### Production Issues
1. Check Vercel Functions logs
2. Verify environment variables in Vercel
3. Check Neon database status

## License

This project is proprietary software. All rights reserved.

---

Last updated: 2025
