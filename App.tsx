import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WorkoutListScreen } from "./src/screens/WorkoutListScreen";
import { colors } from "./src/ui/theme";
import { WorkoutProvider } from "./src/WorkoutContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
          <WorkoutListScreen />
        </SafeAreaView>
        <StatusBar style="light" />
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}
