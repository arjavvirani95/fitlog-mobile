import { describe, expect, it } from "vitest";
import { parseSets, todayIso } from "./parse";

describe("parseSets", () => {
  it("parses reps x weight lists", () => {
    expect(parseSets("5x100, 3x110")).toEqual([{ reps: 5, weight: 100 }, { reps: 3, weight: 110 }]);
  });
  it("expands grouped sets", () => {
    expect(parseSets("3x5@82.5")).toHaveLength(3);
    expect(parseSets("3x5@82.5")![0]).toEqual({ reps: 5, weight: 82.5 });
  });
  it("allows bodyweight (0 kg)", () => {
    expect(parseSets("12x0")).toEqual([{ reps: 12, weight: 0 }]);
  });
  it("rejects malformed input", () => {
    expect(parseSets("")).toBeNull();
    expect(parseSets("five x 100")).toBeNull();
    expect(parseSets("0x100")).toBeNull();
  });
});

it("todayIso pads month and day", () => {
  expect(todayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
});
