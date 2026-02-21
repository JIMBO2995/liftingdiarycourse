import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkoutsByDate(userId: string, date: string) {
  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));

  const workoutsWithExercises = await Promise.all(
    userWorkouts.map(async (workout) => {
      const workoutExercisesList = await db
        .select({
          id: workoutExercises.id,
          order: workoutExercises.order,
          notes: workoutExercises.notes,
          exerciseId: workoutExercises.exerciseId,
          exerciseName: exercises.name,
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.order);

      const exercisesWithSets = await Promise.all(
        workoutExercisesList.map(async (we) => {
          const exerciseSets = await db
            .select({
              id: sets.id,
              setNumber: sets.setNumber,
              reps: sets.reps,
              weight: sets.weight,
              duration: sets.duration,
              rpe: sets.rpe,
              notes: sets.notes,
            })
            .from(sets)
            .where(eq(sets.workoutExerciseId, we.id))
            .orderBy(sets.setNumber);

          return {
            id: we.id,
            name: we.exerciseName,
            order: we.order,
            notes: we.notes,
            sets: exerciseSets,
          };
        })
      );

      return {
        id: workout.id,
        name: workout.name,
        date: workout.date,
        notes: workout.notes,
        exercises: exercisesWithSets,
      };
    })
  );

  return workoutsWithExercises;
}
