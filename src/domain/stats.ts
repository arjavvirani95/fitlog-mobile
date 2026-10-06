import type { ExerciseEntry, SetEntry, Workout } from "./types";

export const setVolume = (s: SetEntry) => s.reps * s.weight;

export const exerciseVolume = (e: ExerciseEntry) => e.sets.reduce((acc, s) => acc + setVolume(s), 0);

export const workoutVolume = (w: Workout) => w.exercises.reduce((acc, e) => acc + exerciseVolume(e), 0);

/** Epley formula estimate of a one-rep max. */
export function estimateOneRepMax({ reps, weight }: SetEntry): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export interface PersonalRecord {
  exercise: string;
  oneRepMax: number;
  date: string;
}

/** Best estimated 1RM per exercise (case-insensitive name match), sorted by name. */
export function personalRecords(workouts: Workout[]): PersonalRecord[] {
  const best = new Map<string, PersonalRecord>();
  for (const w of workouts) {
    for (const e of w.exercises) {
      const key = e.name.trim().toLowerCase();
      for (const s of e.sets) {
        const orm = estimateOneRepMax(s);
        const current = best.get(key);
        if (!current || orm > current.oneRepMax) {
          best.set(key, { exercise: e.name.trim(), oneRepMax: orm, date: w.date });
        }
      }
    }
  }
  return [...best.values()].sort((a, b) => a.exercise.localeCompare(b.exercise));
}

const DAY = 86_400_000;
const toUtc = (d: string) => Date.parse(`${d}T00:00:00Z`);

/** Consecutive days with at least one workout, ending today or yesterday. */
export function currentStreak(workouts: Workout[], today: string): number {
  const days = new Set(workouts.map((w) => toUtc(w.date)));
  let cursor = toUtc(today);
  if (!days.has(cursor)) cursor -= DAY;
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}

/** Total volume for each of the last `weeks` ISO weeks (Mon–Sun), oldest first. */
export function weeklyVolume(workouts: Workout[], today: string, weeks = 6): { weekStart: string; volume: number }[] {
  const t = toUtc(today);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  const thisMonday = t - dow * DAY;
  const buckets = Array.from({ length: weeks }, (_, i) => ({
    start: thisMonday - (weeks - 1 - i) * 7 * DAY,
    volume: 0,
  }));
  for (const w of workouts) {
    const d = toUtc(w.date);
    const b = buckets.find((x) => d >= x.start && d < x.start + 7 * DAY);
    if (b) b.volume += workoutVolume(w);
  }
  return buckets.map((b) => ({ weekStart: new Date(b.start).toISOString().slice(0, 10), volume: b.volume }));
}
