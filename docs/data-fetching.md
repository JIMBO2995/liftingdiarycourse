# Data Fetching Guidelines

## Critical Rules

### 1. Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

- **DO NOT** fetch data using Route Handlers (`app/api/` routes)
- **DO NOT** fetch data on the client using `useEffect`, `useSWR`, `react-query`, or similar
- **DO** fetch data directly in Server Components using async/await

```tsx
// ✅ CORRECT: Fetching in a Server Component
export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutList workouts={workouts} />;
}

// ❌ WRONG: Using a Route Handler
// app/api/workouts/route.ts - DO NOT CREATE THESE FOR DATA FETCHING
```

### 2. Data Access Layer (`/data` Directory)

**ALL database queries MUST be done via helper functions in the `/data` directory.**

- Create helper functions for each data operation
- Never query the database directly in components
- Keep all data access logic centralized and reusable

```
src/
  data/
    workouts.ts    # Workout-related queries
    exercises.ts   # Exercise-related queries
    sets.ts        # Set-related queries
```

### 3. Drizzle ORM Only - NO Raw SQL

**ALL database queries MUST use Drizzle ORM. DO NOT use raw SQL.**

```tsx
// ✅ CORRECT: Using Drizzle ORM
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return await db.select().from(workouts).where(eq(workouts.userId, userId));
}

// ❌ WRONG: Using raw SQL
// db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`)
```

---

## Security: User Data Isolation

### THIS IS CRITICAL

**A logged-in user can ONLY access their own data. They MUST NOT be able to access any other user's data.**

Every data helper function MUST:

1. Accept the `userId` as a parameter
2. Filter ALL queries by `userId`
3. Verify ownership before any read, update, or delete operation

### Implementation Pattern

```tsx
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Always filter by userId
export async function getWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

// For single record access, ALWAYS verify ownership
export async function getWorkoutById(userId: string, workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // CRITICAL: Must include userId check
      )
    );
  return workout;
}

// Updates and deletes MUST include userId in the WHERE clause
export async function deleteWorkout(userId: string, workoutId: string) {
  return await db
    .delete(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // CRITICAL: Prevents deleting other users' data
      )
    );
}
```

### Server Component Usage

```tsx
// src/app/workouts/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkouts } from "@/data/workouts";
import { redirect } from "next/navigation";

export default async function WorkoutsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Pass userId to data helper - ensures user only sees their data
  const workouts = await getWorkouts(userId);

  return <WorkoutList workouts={workouts} />;
}
```

---

## Summary Checklist

Before writing any data fetching code, verify:

- [ ] Data is fetched in a Server Component (not a Route Handler)
- [ ] Database query is in a helper function in `/data`
- [ ] Query uses Drizzle ORM (no raw SQL)
- [ ] Query filters by `userId` to ensure data isolation
- [ ] User authentication is checked before fetching data
