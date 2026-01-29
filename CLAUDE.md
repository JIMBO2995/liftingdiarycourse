# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router pattern with TypeScript.

**Key technologies:**
- Next.js 16 with App Router (`src/app/`)
- React 19
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- Clerk authentication (`@clerk/nextjs`)
- Drizzle ORM with PostgreSQL (Neon)
- ESLint 9 with flat config (`eslint.config.mjs`)
- TypeScript with strict mode

**Path alias:** `@/*` maps to `./src/*`

**Project structure:**
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with ClerkProvider and Geist fonts
- `src/app/page.tsx` - Home page
- `src/app/globals.css` - Global styles
- `src/proxy.ts` - Clerk middleware configuration
- `src/db/schema.ts` - Drizzle database schema
- `src/db/index.ts` - Database connection

## Authentication (Clerk)

Uses `@clerk/nextjs` with App Router pattern:
- `clerkMiddleware()` in `src/proxy.ts` for route protection
- `<ClerkProvider>` wraps the app in `layout.tsx`
- Components: `<SignInButton>`, `<SignUpButton>`, `<SignedIn>`, `<SignedOut>`, `<UserButton>`
- Server-side auth: import `auth()` from `@clerk/nextjs/server` (async)

Environment variables required in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Database (Drizzle + Neon)

**Schema tables:**
- `exercises` - Per-user exercise library (userId + name unique)
- `workouts` - Workout sessions with date
- `workout_exercises` - Junction table linking workouts to exercises (with order)
- `sets` - Individual sets with reps, weight, duration, RPE

**Commands:**
- `npx drizzle-kit push` - Push schema changes to database
- `npx drizzle-kit generate` - Generate migrations
- `npx drizzle-kit studio` - Open Drizzle Studio GUI

Environment variable: `DATABASE_URL`
