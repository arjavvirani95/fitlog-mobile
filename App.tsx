import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LogWorkoutScreen } from "./src/screens/LogWorkoutScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { WorkoutListScreen } from "./src/screens/WorkoutListScreen";
import { TabBar, type Tab } from "./src/ui/TabBar";
import { colors, spacing } from "./src/ui/theme";
import { WorkoutProvider } from "./src/WorkoutContext";

const TITLES: Record<Tab, string> = { history: "History", log: "Log workout", stats: "Progress" };

export default function App() {
  const [tab, setTab] = useState<Tab>("history");

  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
          <Text style={styles.header}>{TITLES[tab]}</Text>
          <View style={{ flex: 1 }}>
            {tab === "history" && <WorkoutListScreen />}
            {tab === "log" && <LogWorkoutScreen onSaved={() => setTab("history")} />}
            {tab === "stats" && <StatsScreen />}
          </View>
          <TabBar active={tab} onChange={setTab} />
        </SafeAreaView>
        <StatusBar style="light" />
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { color: colors.text, fontSize: 28, fontWeight: "700", paddingHorizontal: spacing(4), paddingTop: spacing(2) },
});
