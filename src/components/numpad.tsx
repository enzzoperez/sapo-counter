import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "00"],
];

type Props = {
  onPress: (digit: string) => void;
  onBackspace: () => void;
};

export function Numpad({ onPress, onBackspace }: Props) {
  return (
    <View style={styles.container}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.key, key === "⌫" && styles.backspaceKey]}
              onPress={() => (key === "⌫" ? onBackspace() : onPress(key))}
              activeOpacity={0.6}
            >
              <Text
                style={[styles.keyText, key === "⌫" && styles.backspaceText]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { flexDirection: "row", gap: spacing.sm },
  key: {
    flex: 1,
    height: 56,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  backspaceKey: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keyText: { ...typography.title, color: colors.textPrimary },
  backspaceText: { ...typography.body, color: colors.textSecondary },
});
