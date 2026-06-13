import { View, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/theme";

type Props = { total: number; current: number };

export function RoundIndicator({ total, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i === current ? styles.active : styles.inactive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.xs, justifyContent: "center" },
  dot: { height: 4, borderRadius: 2 },
  active: { width: 24, backgroundColor: colors.accent },
  inactive: { width: 8, backgroundColor: colors.border },
});
