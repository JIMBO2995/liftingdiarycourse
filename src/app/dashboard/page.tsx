import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const selectedDate = params.date || format(new Date(), "yyyy-MM-dd");
  const workouts = await getWorkoutsByDate(userId, selectedDate);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <DatePicker selectedDate={selectedDate} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workouts</h2>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="rounded-lg border p-4">
                {workout.name && (
                  <h3 className="mb-3 font-semibold">{workout.name}</h3>
                )}
                <div className="space-y-4">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id}>
                      <h4 className="mb-2 font-medium">{exercise.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {exercise.sets.map((set) => (
                          <div key={set.id}>
                            Set {set.setNumber}:{" "}
                            {set.reps && `${set.reps} reps`}
                            {set.weight && ` @ ${set.weight} lbs`}
                            {set.rpe && ` (RPE ${set.rpe})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
