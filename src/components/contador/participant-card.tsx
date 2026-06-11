import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { Avatar } from "@/components/shared/avatar";
import { TurnCell } from "./turn-cell";
import { ProgressBar } from "./progress-bar";
import { totalScore } from "@/helpers";
import type { Participant, Mode, TurnScore } from "@/types";

type Props = {
  participant: Participant;
  isActive: boolean;
  activeMemberIdx?: number;
  onAnnotate: () => void;
  mode: Mode;
  target?: number;
  totalTurns?: number;
  currentTurnIdx: number;
};

function getCellState(
  cellIdx: number,
  participant: Participant,
  isActive: boolean,
): "completed" | "current" | "future" {
  if (cellIdx < participant.turns.length) return "completed";
  if (cellIdx === participant.turns.length && isActive) return "current";
  return "future";
}

function memberBreakdownForTurn(turn: TurnScore): string {
  if (!Array.isArray(turn)) return "";
  return turn.join(" + ");
}

function memberAccumulatedBreakdown(participant: Participant): string {
  if (!participant.members) return "";
  return participant.members
    .map((m, mi) => {
      const total = participant.turns.reduce<number>(
        (sum, t) => (Array.isArray(t) ? sum + (t[mi] ?? 0) : sum),
        0,
      );
      return `${m.name} ${total}`;
    })
    .join(" · ");
}

export function ParticipantCard({
  participant,
  isActive,
  activeMemberIdx,
  onAnnotate,
  mode,
  target,
  totalTurns,
  currentTurnIdx,
}: Props) {
  const score = totalScore(participant);
  const accentColor = participant.color ?? colors.accent;

  const cellCount =
    mode === "turns"
      ? totalTurns!
      : Math.max(participant.turns.length + 1, currentTurnIdx + 2);

  return (
    <View style={[styles.card, isActive ? styles.cardActive : styles.cardIdle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar
            name={participant.name}
            color={participant.color}
            active={isActive}
          />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{participant.name}</Text>
            {isActive && (
              <Text style={styles.activeBadge}>
                {activeMemberIdx !== undefined && participant.members
                  ? `▶ Tirando: ${participant.members[activeMemberIdx]?.name ?? ""}`
                  : "▶ Tirando ahora"}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.scoreBlock}>
          {mode === "goal" && target ? (
            <Text style={styles.score}>
              {score} <Text style={styles.scoreTarget}>/{target}</Text>
            </Text>
          ) : (
            <Text style={styles.score}>{score}</Text>
          )}
        </View>
      </View>

      {/* Team member breakdown */}
      {participant.members && participant.turns.length > 0 && (
        <View style={styles.memberPill}>
          <Text style={styles.memberPillText}>
            {memberAccumulatedBreakdown(participant)}
          </Text>
        </View>
      )}

      {/* Progress bar (goal mode) */}
      {mode === "goal" && target != null && (
        <ProgressBar value={score} max={target} color={accentColor} />
      )}

      {/* Turn cells */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cellsScroll}
        contentContainerStyle={styles.cellsContent}
      >
        {Array.from({ length: cellCount }, (_, i) => {
          const cs = getCellState(i, participant, isActive);
          const turn = participant.turns[i];
          const breakdown =
            participant.members && turn !== undefined
              ? memberBreakdownForTurn(turn)
              : undefined;
          return (
            <TurnCell
              key={i}
              index={i}
              cellState={cs}
              score={turn}
              memberBreakdown={breakdown}
              onPress={cs === "current" ? onAnnotate : undefined}
              accentColor={accentColor}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardIdle: {
    backgroundColor: colors.bgElevated,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  // Approximates the spec's subtle accentBg→bgElevated gradient with a flat
  // accent-tinted surface + accent border (no extra gradient lib).
  cardActive: {
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  nameBlock: { gap: 2 },
  name: { ...typography.itemName, color: colors.textPrimary },
  activeBadge: { ...typography.micro, color: colors.accent, letterSpacing: 0 },
  scoreBlock: { alignItems: "flex-end" },
  score: {
    ...typography.score,
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  scoreTarget: { ...typography.caption, color: colors.textMuted },
  memberPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  memberPillText: { ...typography.caption, color: colors.textSecondary },
  cellsScroll: { marginHorizontal: -spacing.lg },
  cellsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: "row",
  },
});
