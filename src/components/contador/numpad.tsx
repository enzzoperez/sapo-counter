import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
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
          {row.map((key) => {
            const isBackspace = key === "⌫";
            return (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => (isBackspace ? onBackspace() : onPress(key))}
                activeOpacity={0.6}
              >
                {isBackspace ? (
                  <Feather
                    name="delete"
                    size={22}
                    color={colors.textSecondary}
                  />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { ...typography.numpad, color: colors.textPrimary },
});
