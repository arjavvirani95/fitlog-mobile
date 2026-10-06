import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { workoutVolume } from "../domain/stats";
import type { Workout } from "../domain/types";
import { colors, spacing } from "../ui/theme";
import { useWorkouts } from "../WorkoutContext";

export function WorkoutListScreen() {
  const { state, dispatch } = useWorkouts();

  const confirmDelete = (w: Workout) =>
    Alert.alert("Delete workout?", `${w.title} on ${w.date}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch({ type: "remove", id: w.id }) },
    ]);

  if (state.loaded && state.workouts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No workouts yet</Text>
        <Text style={styles.muted}>Tap “Log” to record your first session.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.workouts}
      keyExtractor={(w) => w.id}
      contentContainerStyle={{ padding: spacing(4), gap: spacing(3) }}
      renderItem={({ item }) => (
        <Pressable onLongPress={() => confirmDelete(item)} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>{item.date}</Text>
          </View>
          <Text style={styles.muted}>
            {item.exercises.map((e) => e.name).join(" · ") || "No exercises"}
          </Text>
          <Text style={styles.volume}>{workoutVolume(item).toLocaleString()} kg volume</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 12, padding: spacing(4), gap: spacing(1) },
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: colors.text, fontSize: 17, fontWeight: "600" },
  muted: { color: colors.muted },
  volume: { color: colors.accent, marginTop: spacing(1), fontWeight: "500" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing(2) },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "600" },
});
