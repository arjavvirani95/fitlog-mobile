import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { colors, spacing } from "./theme";

interface Props extends PressableProps {
  label: string;
  variant?: "primary" | "ghost" | "danger";
}

export function Button({ label, variant = "primary", style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && { opacity: 0.7 },
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, variant !== "primary" && { color: variant === "danger" ? colors.danger : colors.accent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: spacing(3), paddingHorizontal: spacing(4), borderRadius: 10, alignItems: "center" },
  primary: { backgroundColor: colors.accent },
  ghost: { borderWidth: 1, borderColor: colors.border },
  danger: { borderWidth: 1, borderColor: colors.danger },
  label: { color: "#052e16", fontWeight: "600", fontSize: 16 },
});
