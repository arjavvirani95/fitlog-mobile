import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Workout } from "./domain/types";

const KEY = "fitlog/workouts/v1";

export async function loadWorkouts(): Promise<Workout[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Workout[]) : [];
  } catch {
    return [];
  }
}

export async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(workouts));
}
