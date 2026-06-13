import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { Avatar } from "@/components/shared/avatar";
import { TurnCell } from "./turn-cell";
import { ProgressBar } from "./progress-bar";
import { totalScore } from "@/helpers";
import type { Participant, Player, Mode, TurnScore } from "@/types";

type Props = {
  participant: Participant;
  isActive: boolean;
  /** In-progress member scores for this team's current turn (member index order). */
  pendingScores?: number[];
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

/** Expanded breakdown of the active team's in-progress turn. */
function TeamTurnBreakdown({
  members,
  pendingScores,
  turnIdx,
}: {
  members: Player[];
  pendingScores: number[];
  turnIdx: number;
}) {
  const subtotal = pendingScores.reduce((a, b) => a + b, 0);
  return (
    <View style={styles.breakdown}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTurn}>TURNO {turnIdx + 1}</Text>
        <Text style={styles.breakdownSubtotal}>{subtotal} pts</Text>
      </View>
      {members.map((m, i) => {
        const didThrow = i < pendingScores.length;
        return (
          <View
            key={m.id}
            style={[styles.memberRow, i > 0 && styles.memberRowBorder]}
          >
            <View style={styles.memberLeft}>
              <Feather
                name={didThrow ? "check" : "clock"}
                size={13}
                color={didThrow ? colors.accent : colors.gold}
              />
              <Text
                style={didThrow ? styles.memberNameDone : styles.memberNamePending}
              >
                {m.name}
              </Text>
            </View>
            {didThrow ? (
              <Text style={styles.memberScore}>{pendingScores[i]}</Text>
            ) : (
              <Text style={styles.memberPendingLabel}>pendiente</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function ParticipantCard({
  participant,
  isActive,
  pendingScores,
  onAnnotate,
  mode,
  target,
  totalTurns,
  currentTurnIdx,
}: Props) {
  const score = totalScore(participant);
  const accentColor = participant.color ?? colors.accent;
  const isTeam = !!participant.members;
  const showTeamBreakdown = isActive && isTeam;

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
            {isActive &&
              (isTeam ? (
                <Text style={styles.teamTurnBadge}>Turno en curso</Text>
              ) : (
                <Text style={styles.activeBadge}>▶ Tirando ahora</Text>
              ))}
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

      {/* Progress bar (goal mode) */}
      {mode === "goal" && target != null && (
        <ProgressBar value={score} max={target} color={accentColor} />
      )}

      {showTeamBreakdown ? (
        <>
          <TeamTurnBreakdown
            members={participant.members!}
            pendingScores={pendingScores ?? []}
            turnIdx={currentTurnIdx}
          />
          {/* Previous turns (muted, total only) */}
          {participant.turns.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cellsScroll}
              contentContainerStyle={styles.cellsContent}
            >
              {participant.turns.map((t, i) => (
                <TurnCell
                  key={i}
                  index={i}
                  cellState="completed"
                  score={t}
                  muted
                />
              ))}
            </ScrollView>
          )}
        </>
      ) : (
        /* Normal cell row (individual + inactive teams) */
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
      )}
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
  teamTurnBadge: { ...typography.captionMedium, color: colors.accent },
  scoreBlock: { alignItems: "flex-end" },
  score: {
    ...typography.score,
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  scoreTarget: { ...typography.caption, color: colors.textMuted },
  // Active team turn breakdown
  breakdown: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    padding: spacing.sm + 2,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.xs,
  },
  breakdownTurn: { ...typography.micro, color: colors.textTertiary },
  breakdownSubtotal: { ...typography.captionMedium, color: colors.accent },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  memberRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  memberLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  memberNameDone: { ...typography.caption, color: colors.textSecondary },
  memberNamePending: {
    ...typography.caption,
    fontWeight: "500",
    color: colors.gold,
  },
  memberScore: {
    ...typography.subtitle,
    fontWeight: "600",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  memberPendingLabel: { ...typography.caption, color: colors.textDisabled },
  cellsScroll: { marginHorizontal: -spacing.lg },
  cellsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: "row",
  },
});
