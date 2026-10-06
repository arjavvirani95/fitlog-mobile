export interface SetEntry {
  reps: number;
  weight: number; // kg
}

export interface ExerciseEntry {
  name: string;
  sets: SetEntry[];
}

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  exercises: ExerciseEntry[];
  notes?: string;
}
