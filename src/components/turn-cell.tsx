import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { turnScore } from "../helpers";
import type { TurnScore } from "../types";

type CellState = "completed" | "current" | "future";

type Props = {
  index: number;
  cellState: CellState;
  score?: TurnScore;
  memberBreakdown?: string;
  onPress?: () => void;
  accentColor?: string;
};

export function TurnCell({
  index,
  cellState,
  score,
  memberBreakdown,
  onPress,
  accentColor = colors.accent,
}: Props) {
  const label = `T${index + 1}`;

  if (cellState === "future") {
    return (
      <View style={styles.future}>
        <Text style={styles.microLabel}>{label}</Text>
        <Text style={styles.dash}>—</Text>
      </View>
    );
  }

  if (cellState === "current") {
    return (
      <TouchableOpacity
        style={[styles.current, { backgroundColor: accentColor }]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <Text style={styles.microLabelCurrent}>{label}</Text>
        <Text style={styles.annotateText}>+ Anotar</Text>
      </TouchableOpacity>
    );
  }

  const val = score !== undefined ? turnScore(score) : 0;
  return (
    <View style={styles.completed}>
      <Text style={styles.microLabel}>{label}</Text>
      <Text style={styles.scoreText}>{val}</Text>
      {memberBreakdown && (
        <Text style={styles.breakdown}>{memberBreakdown}</Text>
      )}
    </View>
  );
}

const CELL_WIDTH = 64;

const styles = StyleSheet.create({
  future: {
    width: CELL_WIDTH,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  current: {
    width: CELL_WIDTH,
    height: 64,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  completed: {
    width: CELL_WIDTH,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  microLabel: {
    ...typography.micro,
    color: colors.textTertiary,
  },
  microLabelCurrent: {
    ...typography.micro,
    color: colors.bgPrimary,
    opacity: 0.8,
  },
  dash: { ...typography.body, color: colors.textTertiary },
  annotateText: {
    ...typography.captionMedium,
    color: colors.bgPrimary,
  },
  scoreText: { ...typography.scoreSmall, color: colors.textPrimary },
  breakdown: {
    ...typography.micro,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
