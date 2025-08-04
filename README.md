# UNI LIFE Tournament System

A serverless tournament management system for organizing Swiss-system and elimination tournaments.

## 🚀 Quick Links

- **Production Site**: https://unilife.fi
- **Admin Panel**: https://unilife.fi/admin
- **Vercel Dashboard**: https://vercel.com/villes-97-hotmailcoms-projects/unilife
- **Neon Database Console**: https://console.neon.tech/app/projects/misty-breeze-05142636?branchId=br-round-violet-a2z56wet
- **GitHub Repository**: https://github.com/strengv1/unilife

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: 
  - Production: Neon (Serverless PostgreSQL)
  - Development: Docker PostgreSQL
- **ORM**: Drizzle ORM
- **Hosting**: Vercel (Serverless)
- **Authentication**: JWT with httpOnly cookies

## 📁 Project Structure
```
src/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx             # Admin login & main page
│   │   ├── tournaments/[slug]/   # Tournament management
│   │   └── components/          # Admin components
│   ├── events/[slug]/
│   │   ├── bracket/             # Public bracket view
│   │   │   ├── page.tsx        # Live bracket display
│   │   │   └── admin/          # Score reporter
│   │   └── components/         # Bracket components
│   ├── api/
│   │   ├── auth/               # Authentication endpoints
│   │   └── tournaments/        # Tournament CRUD operations
│   ├── lib/
│   │   ├── db.ts              # Database connection
│   │   ├── schema.ts          # Database schema
│   │   ├── auth.ts            # Auth utilities
│   │   └── tournament-logic.ts # Swiss & elimination logic
│   └── hooks/                  # Custom React hooks
├── public/
│   └── archives/              # Static tournament archives
└── docker-compose.yml         # Local PostgreSQL setup
```

## 🏃‍♂️ Development Setup

### Prerequisites
- Node.js 18+
- Docker Desktop (for local database)
- Git

### Initial Setup

1. **Clone and install dependencies**
  ```bash
  git clone https://github.com/your-username/unilife
  cd unilife
  npm install
  ```
2. **Start local database**
  ```bash
  npm run docker:up
  ```
3. **Set up environment variables**
  ```bash
  cp .env.example .env.local

  # Edit .env.local with:
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tournament_dev"
  ADMIN_PASSWORD="your-dev-password"
  JWT_SECRET="your-dev-jwt-secret"
  ```
4. **Start local database**
  ```bash
  npm run db:push
  ```
5. **Start dev server**
  ```bash
  npm run dev
  ```

## 📝 Common Tasks

### Database Operations

**View Database Locally**
  ```bash
  npm run db:studio
  ```
Opens Drizzle Studio at https://local.drizzle.studio

**Access Production Database**
1. Go to Neon Console
2. Select your project
3. Use SQL Editor for queries

**Deployment**
- Vercel auto-deploys on push to main branch.

- Update Production Database Schema

  ````bash
  copy .env.local .env.local.backup
  copy .env.production.local .env.local
  npx drizzle-kit push
  copy .env.local.backup .env.local
  del .env.local.backup
  ```
