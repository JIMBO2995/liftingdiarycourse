"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for UI display
const mockWorkouts = [
  {
    id: "1",
    name: "Bench Press",
    sets: [
      { reps: 10, weight: 135 },
      { reps: 8, weight: 155 },
      { reps: 6, weight: 175 },
    ],
  },
  {
    id: "2",
    name: "Squat",
    sets: [
      { reps: 8, weight: 185 },
      { reps: 8, weight: 205 },
      { reps: 6, weight: 225 },
    ],
  },
  {
    id: "3",
    name: "Deadlift",
    sets: [
      { reps: 5, weight: 225 },
      { reps: 5, weight: 275 },
      { reps: 3, weight: 315 },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workouts</h2>

        {mockWorkouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="space-y-4">
            {mockWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="rounded-lg border p-4"
              >
                <h3 className="mb-2 font-medium">{workout.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {workout.sets.map((set, index) => (
                    <div key={index}>
                      Set {index + 1}: {set.reps} reps @ {set.weight} lbs
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
