import { describe, expect, it } from "vitest";
import { currentStreak, estimateOneRepMax, personalRecords, weeklyVolume, workoutVolume } from "./stats";
import type { Workout } from "./types";

const w = (date: string, name: string, sets: [number, number][]): Workout => ({
  id: date + name,
  date,
  title: "Session",
  exercises: [{ name, sets: sets.map(([reps, weight]) => ({ reps, weight })) }],
});

describe("volume", () => {
  it("sums reps x weight", () => {
    expect(workoutVolume(w("2026-10-01", "Squat", [[5, 100], [5, 100], [3, 110]]))).toBe(1330);
  });
});

describe("estimateOneRepMax", () => {
  it("uses Epley for multiple reps", () => {
    expect(estimateOneRepMax({ reps: 5, weight: 100 })).toBe(116.7);
    expect(estimateOneRepMax({ reps: 1, weight: 140 })).toBe(140);
    expect(estimateOneRepMax({ reps: 0, weight: 100 })).toBe(0);
  });
});

describe("personalRecords", () => {
  it("keeps the best set per exercise, ignoring case", () => {
    const prs = personalRecords([
      w("2026-09-01", "Bench Press", [[5, 80]]),
      w("2026-09-08", "bench press", [[3, 90]]),
      w("2026-09-08", "Deadlift", [[5, 140]]),
    ]);
    expect(prs).toEqual([
      { exercise: "bench press", oneRepMax: 99, date: "2026-09-08" },
      { exercise: "Deadlift", oneRepMax: 163.3, date: "2026-09-08" },
    ]);
  });
});

describe("currentStreak", () => {
  const log = ["2026-10-01", "2026-10-02", "2026-10-03"].map((d) => w(d, "Run", [[1, 1]]));
  it("counts back from today", () => expect(currentStreak(log, "2026-10-03")).toBe(3));
  it("still counts if today is not logged yet", () => expect(currentStreak(log, "2026-10-04")).toBe(3));
  it("breaks after a missed day", () => expect(currentStreak(log, "2026-10-05")).toBe(0));
});

describe("weeklyVolume", () => {
  it("buckets by Monday-start weeks", () => {
    // 2026-10-05 is a Monday
    const res = weeklyVolume(
      [w("2026-10-05", "Squat", [[10, 50]]), w("2026-10-04", "Squat", [[10, 20]]), w("2026-09-28", "Squat", [[1, 30]])],
      "2026-10-06",
      2,
    );
    expect(res).toEqual([
      { weekStart: "2026-09-28", volume: 230 },
      { weekStart: "2026-10-05", volume: 500 },
    ]);
  });
});
