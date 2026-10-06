import { ScrollView, StyleSheet, Text, View } from "react-native";
import { todayIso } from "../domain/parse";
import { currentStreak, personalRecords, weeklyVolume } from "../domain/stats";
import { colors, spacing } from "../ui/theme";
import { useWorkouts } from "../WorkoutContext";

export function StatsScreen() {
  const { workouts } = useWorkouts().state;
  const today = todayIso();
  const weeks = weeklyVolume(workouts, today, 6);
  const max = Math.max(1, ...weeks.map((w) => w.volume));
  const prs = personalRecords(workouts);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tiles}>
        <Tile label="Day streak" value={String(currentStreak(workouts, today))} />
        <Tile label="Workouts" value={String(workouts.length)} />
      </View>

      <Text style={styles.section}>Weekly volume (kg)</Text>
      <View style={styles.chart} accessibilityLabel="Weekly volume chart">
        {weeks.map((w) => (
          <View key={w.weekStart} style={styles.barCol}>
            <Text style={styles.barValue}>{w.volume ? Math.round(w.volume / 1000) + "k" : ""}</Text>
            <View style={[styles.bar, { height: `${(w.volume / max) * 100}%` }]} />
            <Text style={styles.barLabel}>{w.weekStart.slice(5)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Personal records (est. 1RM)</Text>
      {prs.length === 0 ? (
        <Text style={styles.muted}>Log weighted sets to see your PRs.</Text>
      ) : (
        prs.map((pr) => (
          <View key={pr.exercise} style={styles.prRow}>
            <Text style={styles.prName}>{pr.exercise}</Text>
            <Text style={styles.prValue}>{pr.oneRepMax} kg</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing(4), gap: spacing(3) },
  tiles: { flexDirection: "row", gap: spacing(3) },
  tile: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: spacing(4) },
  tileValue: { color: colors.text, fontSize: 28, fontWeight: "700" },
  muted: { color: colors.muted },
  section: { color: colors.text, fontSize: 18, fontWeight: "600", marginTop: spacing(2) },
  chart: {
    height: 180, flexDirection: "row", alignItems: "flex-end", gap: spacing(2),
    backgroundColor: colors.card, borderRadius: 12, padding: spacing(3),
  },
  barCol: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center", gap: spacing(1) },
  bar: { width: "70%", backgroundColor: colors.accent, borderRadius: 4, minHeight: 2 },
  barValue: { color: colors.muted, fontSize: 11 },
  barLabel: { color: colors.muted, fontSize: 11 },
  prRow: {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: colors.card, borderRadius: 10, padding: spacing(3),
  },
  prName: { color: colors.text, fontSize: 16 },
  prValue: { color: colors.accent, fontWeight: "600", fontSize: 16 },
});
