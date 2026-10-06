import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { parseSets, todayIso } from "../domain/parse";
import { newId } from "../domain/reducer";
import { Button } from "../ui/Button";
import { colors, spacing } from "../ui/theme";
import { useWorkouts } from "../WorkoutContext";

interface Row {
  key: string;
  name: string;
  sets: string;
}

const emptyRow = (): Row => ({ key: newId(), name: "", sets: "" });

export function LogWorkoutScreen({ onSaved }: { onSaved: () => void }) {
  const { dispatch } = useWorkouts();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayIso());
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  function save() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError("Date must be YYYY-MM-DD");
    const filled = rows.filter((r) => r.name.trim() || r.sets.trim());
    if (filled.length === 0) return setError("Add at least one exercise");
    const exercises = [];
    for (const r of filled) {
      const sets = parseSets(r.sets);
      if (!r.name.trim() || !sets) return setError(`Check “${r.name || "unnamed"}”: use sets like 5x100 or 3x5@80`);
      exercises.push({ name: r.name.trim(), sets });
    }
    dispatch({ type: "add", workout: { id: newId(), date, title: title.trim() || "Workout", exercises } });
    setTitle("");
    setRows([emptyRow()]);
    setError(null);
    onSaved();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="Push day" />
        <Field label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        <Text style={styles.section}>Exercises</Text>
        {rows.map((r) => (
          <View key={r.key} style={styles.exercise}>
            <TextInput
              style={styles.input}
              value={r.name}
              onChangeText={(name) => update(r.key, { name })}
              placeholder="Exercise (e.g. Bench Press)"
              placeholderTextColor={colors.muted}
            />
            <TextInput
              style={styles.input}
              value={r.sets}
              onChangeText={(sets) => update(r.key, { sets })}
              placeholder="Sets: 5x80, 5x80 or 3x5@80"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
            />
            {rows.length > 1 && (
              <Button label="Remove" variant="danger" onPress={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} />
            )}
          </View>
        ))}
        <Button label="+ Add exercise" variant="ghost" onPress={() => setRows((rs) => [...rs, emptyRow()])} />

        {error && <Text style={styles.error}>{error}</Text>}
        <Button label="Save workout" onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: { label: string } & React.ComponentProps<typeof TextInput>) {
  const { label, ...input } = props;
  return (
    <View style={{ gap: spacing(1) }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} {...input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing(4), gap: spacing(3) },
  label: { color: colors.muted, fontSize: 13 },
  section: { color: colors.text, fontSize: 18, fontWeight: "600", marginTop: spacing(2) },
  exercise: { backgroundColor: colors.card, borderRadius: 12, padding: spacing(3), gap: spacing(2) },
  input: {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    fontSize: 16,
  },
  error: { color: colors.danger },
});
