import type { SetEntry } from "./types";

/**
 * Parses shorthand like "5x100, 5x100, 3x110" or "3x5@80" (3 sets of 5 reps at 80 kg).
 * Returns null if any part is malformed.
 */
export function parseSets(input: string): SetEntry[] | null {
  const parts = input.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const sets: SetEntry[] = [];
  for (const part of parts) {
    const grouped = part.match(/^(\d+)\s*x\s*(\d+)\s*@\s*(\d+(?:\.\d+)?)$/i);
    if (grouped) {
      const [, count, reps, weight] = grouped;
      for (let i = 0; i < Number(count); i++) sets.push({ reps: Number(reps), weight: Number(weight) });
      continue;
    }
    const single = part.match(/^(\d+)\s*x\s*(\d+(?:\.\d+)?)$/i);
    if (!single) return null;
    sets.push({ reps: Number(single[1]), weight: Number(single[2]) });
  }
  return sets.every((s) => s.reps > 0) ? sets : null;
}

export const todayIso = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
