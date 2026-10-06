import { todayIso } from "./parse";
import type { Workout } from "./types";

/** Four weeks of push/pull/legs sessions with gradual progression, for trying the app out. */
export function sampleWorkouts(today = new Date()): Workout[] {
  const plan = [
    { title: "Push", lifts: [["Bench Press", 70], ["Overhead Press", 40]] },
    { title: "Pull", lifts: [["Deadlift", 120], ["Barbell Row", 60]] },
    { title: "Legs", lifts: [["Squat", 95], ["Romanian Deadlift", 80]] },
  ] as const;
  const out: Workout[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - Math.floor(i * 2.4)));
    const { title, lifts } = plan[i % 3];
    const week = Math.floor(i / 3);
    out.push({
      id: `sample-${i}`,
      date: todayIso(d),
      title,
      exercises: lifts.map(([name, base]) => ({
        name,
        sets: Array.from({ length: 3 }, () => ({ reps: 5, weight: base + week * 2.5 })),
      })),
    });
  }
  return out;
}
