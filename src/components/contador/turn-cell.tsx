import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { turnScore } from "@/helpers";
import type { TurnScore } from "@/types";

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
        <Text style={styles.microDisabled}>{label}</Text>
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
        <Text style={styles.microCurrent}>{label}</Text>
        <Text style={styles.annotateText}>+ Anotar</Text>
      </TouchableOpacity>
    );
  }

  const val = score !== undefined ? turnScore(score) : 0;
  return (
    <View style={styles.completed}>
      <Text style={styles.microLabel}>{label}</Text>
      <Text style={styles.scoreText}>{val}</Text>
      {memberBreakdown ? (
        <Text style={styles.breakdown}>{memberBreakdown}</Text>
      ) : null}
    </View>
  );
}

const CELL_WIDTH = 64;
const CELL_HEIGHT = 64;

const styles = StyleSheet.create({
  future: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderStyle: "dashed",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  current: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  completed: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  microLabel: { ...typography.micro, color: colors.textMuted },
  microDisabled: { ...typography.micro, color: colors.textDisabled },
  microCurrent: { ...typography.micro, color: colors.accentDark, opacity: 0.85 },
  dash: { ...typography.body, color: colors.textDisabled },
  annotateText: { ...typography.captionMedium, color: colors.accentDark },
  scoreText: { ...typography.scoreSmall, color: colors.textSecondary },
  breakdown: {
    ...typography.micro,
    color: colors.textDisabled,
    textAlign: "center",
  },
});
