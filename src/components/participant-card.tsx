import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { TurnCell } from "./turn-cell";
import { ProgressBar } from "./progress-bar";
import { totalScore } from "../helpers";
import type { Participant, Mode, TurnScore } from "../types";

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

function Avatar({
  name,
  color,
  size = 28,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const bg = color ?? colors.accentBg;
  const fg = color ? colors.bgPrimary : colors.accentText;
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={[styles.avatarText, { color: fg }]}>
        {name.charAt(0).toUpperCase() || "?"}
      </Text>
    </View>
  );
}

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
  const memberTotals = participant.members.map((m, mi) => {
    const total = participant.turns.reduce((sum, t) => {
      if (Array.isArray(t)) return sum + (t[mi] ?? 0);
      return sum;
    }, 0);
    return `${m.name} ${total}`;
  });
  return memberTotals.join(" · ");
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
  const borderStyle = isActive
    ? { borderWidth: 2, borderColor: accentColor }
    : { borderWidth: 0.5, borderColor: colors.border };

  const cellCount =
    mode === "turns"
      ? totalTurns!
      : Math.max(participant.turns.length + 1, currentTurnIdx + 2);

  return (
    <View style={[styles.card, borderStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar name={participant.name} color={participant.color} />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{participant.name}</Text>
            {isActive && (
              <Text style={styles.activeBadge}>
                {activeMemberIdx !== undefined && participant.members
                  ? `▶ ${participant.members[activeMemberIdx]?.name ?? "tirando"}`
                  : "▶ tirando"}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.scoreBlock}>
          {mode === "goal" && target ? (
            <Text style={styles.score}>
              {score} <Text style={styles.scoreTertiary}>/ {target}</Text>
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
        <View style={styles.progressWrap}>
          <ProgressBar value={score} max={target} color={accentColor} />
        </View>
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
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
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
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { ...typography.captionMedium },
  nameBlock: { gap: 2 },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  activeBadge: { ...typography.caption, color: colors.accent },
  scoreBlock: { alignItems: "flex-end" },
  score: { ...typography.score, color: colors.textPrimary },
  scoreTertiary: {
    ...typography.captionMedium,
    color: colors.textTertiary,
  },
  memberPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  memberPillText: { ...typography.caption, color: colors.textSecondary },
  progressWrap: { marginTop: -spacing.xs },
  cellsScroll: { marginHorizontal: -spacing.lg },
  cellsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: "row",
  },
});
