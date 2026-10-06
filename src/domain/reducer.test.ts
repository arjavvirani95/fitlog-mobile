import { describe, expect, it } from "vitest";
import { initialState, reducer } from "./reducer";
import type { Workout } from "./types";

const wk = (id: string, date: string): Workout => ({ id, date, title: id, exercises: [] });

describe("reducer", () => {
  it("hydrates sorted newest first", () => {
    const s = reducer(initialState, { type: "hydrate", workouts: [wk("a", "2026-01-01"), wk("b", "2026-02-01")] });
    expect(s.loaded).toBe(true);
    expect(s.workouts.map((w) => w.id)).toEqual(["b", "a"]);
  });

  it("adds, updates and removes", () => {
    let s = reducer(initialState, { type: "add", workout: wk("a", "2026-01-01") });
    s = reducer(s, { type: "update", workout: { ...wk("a", "2026-01-01"), title: "Leg day" } });
    expect(s.workouts[0].title).toBe("Leg day");
    s = reducer(s, { type: "remove", id: "a" });
    expect(s.workouts).toEqual([]);
  });
});
