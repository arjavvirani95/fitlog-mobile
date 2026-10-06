import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "./theme";

export type Tab = "history" | "log" | "stats";
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "history", label: "History", icon: "☰" },
  { key: "log", label: "Log", icon: "＋" },
  { key: "stats", label: "Stats", icon: "▮" },
];

export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map((t) => {
        const selected = t.key === active;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(t.key)}
            style={styles.tab}
          >
            <Text style={[styles.icon, selected && styles.active]}>{t.icon}</Text>
            <Text style={[styles.label, selected && styles.active]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  tab: { flex: 1, alignItems: "center", paddingVertical: spacing(2.5) },
  icon: { color: colors.muted, fontSize: 18 },
  label: { color: colors.muted, fontSize: 12, marginTop: 2 },
  active: { color: colors.accent },
});
