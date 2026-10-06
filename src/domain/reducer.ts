import type { Workout } from "./types";

export interface State {
  workouts: Workout[];
  loaded: boolean;
}

export type Action =
  | { type: "hydrate"; workouts: Workout[] }
  | { type: "add"; workout: Workout }
  | { type: "update"; workout: Workout }
  | { type: "remove"; id: string };

export const initialState: State = { workouts: [], loaded: false };

const byDateDesc = (a: Workout, b: Workout) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id);

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { workouts: [...action.workouts].sort(byDateDesc), loaded: true };
    case "add":
      return { ...state, workouts: [action.workout, ...state.workouts].sort(byDateDesc) };
    case "update":
      return {
        ...state,
        workouts: state.workouts.map((w) => (w.id === action.workout.id ? action.workout : w)).sort(byDateDesc),
      };
    case "remove":
      return { ...state, workouts: state.workouts.filter((w) => w.id !== action.id) };
  }
}

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
