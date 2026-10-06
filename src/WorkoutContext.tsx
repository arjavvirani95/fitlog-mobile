import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import { initialState, reducer, type Action, type State } from "./domain/reducer";
import { loadWorkouts, saveWorkouts } from "./storage";

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadWorkouts().then((workouts) => dispatch({ type: "hydrate", workouts }));
  }, []);

  useEffect(() => {
    if (state.loaded) saveWorkouts(state.workouts).catch(() => {});
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useWorkouts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkouts must be used inside WorkoutProvider");
  return ctx;
}
