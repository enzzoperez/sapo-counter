import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { useGame } from "@/state/game-context";
import { totalScore, turnScore, getWinner } from "@/helpers";
import type { Participant } from "@/types";

export function FinalScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();

  // Guard: if state was cleared navigate to setup (effect, not render)
  useEffect(() => {
    if (!state) router.replace("/");
  }, [!!state]);

  if (!state) return null;

  const { participants, mode, targetScore } = state;
  const winner = getWinner(participants);
  const isMultiWinner = Array.isArray(winner);
  const winners = Array.isArray(winner) ? winner : [winner];

  const sorted = [...participants].sort(
    (a, b) => totalScore(b) - totalScore(a),
  );

  function rankOf(p: Participant): number {
    return sorted.findIndex((s) => s.id === p.id) + 1;
  }

  function winnerSubtitle(w: Participant): string {
    const score = totalScore(w);
    const turns = w.turns.length;
    if (mode === "turns") return `Ganó con ${score} pts en ${turns} turnos`;
    return `Llegó a ${targetScore} en ${turns} turnos`;
  }

  function handleRematch() {
    dispatch({ type: "REMATCH" });
    router.back();
  }

  function handleNewGame() {
    dispatch({ type: "NEW_GAME" });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Winner header */}
      <View style={styles.winnerHeader}>
        <Feather name="award" size={48} color={colors.warning} />
        <Text style={styles.winnerMicro}>
          {isMultiWinner ? "EMPATE" : "GANADOR"}
        </Text>
        <Text style={styles.winnerName}>
          {isMultiWinner
            ? winners.map((w) => w.name).join(" · ")
            : winners[0].name}
        </Text>
        {!isMultiWinner && (
          <Text style={styles.winnerSubtitle}>
            {winnerSubtitle(winners[0])}
          </Text>
        )}
      </View>

      {/* Ranking */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.rankingContent}
        showsVerticalScrollIndicator={false}
      >
        {sorted.map((p) => {
          const rank = rankOf(p);
          const isFirst = rank === 1;
          return (
            <View
              key={p.id}
              style={[
                styles.rankCard,
                isFirst ? styles.rankCardFirst : styles.rankCardRest,
              ]}
            >
              <View style={styles.rankCardHeader}>
                <View style={styles.rankLeft}>
                  <View
                    style={[
                      styles.rankAvatar,
                      {
                        backgroundColor: isFirst
                          ? colors.warningBg
                          : colors.bgSecondary,
                      },
                      p.color && { backgroundColor: p.color + "33" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankAvatarText,
                        {
                          color: isFirst
                            ? colors.warningText
                            : colors.textSecondary,
                        },
                        p.color && { color: p.color },
                      ]}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.rankName,
                        isFirst && { color: colors.warningText },
                      ]}
                    >
                      {p.name}
                    </Text>
                    <Text style={styles.rankPosition}>{rank}°</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.rankScore,
                    isFirst && { color: colors.warningText },
                  ]}
                >
                  {totalScore(p)}
                </Text>
              </View>

              {/* Turn pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.turnPills}
              >
                {p.turns.map((t, i) => (
                  <View
                    key={i}
                    style={[styles.turnPill, isFirst && styles.turnPillFirst]}
                  >
                    <Text style={styles.turnPillLabel}>T{i + 1}</Text>
                    <Text
                      style={[
                        styles.turnPillScore,
                        isFirst && { color: colors.warningText },
                      ]}
                    >
                      {turnScore(t)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.rematchBtn} onPress={handleRematch}>
          <Feather name="refresh-cw" size={16} color={colors.accent} />
          <Text style={styles.rematchText}>Revancha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newGameBtn} onPress={handleNewGame}>
          <Feather name="home" size={16} color={colors.bgPrimary} />
          <Text style={styles.newGameText}>Nueva partida</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  winnerHeader: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  winnerMicro: { ...typography.micro, color: colors.textTertiary },
  winnerName: { ...typography.title, color: colors.textPrimary },
  winnerSubtitle: { ...typography.caption, color: colors.textTertiary },
  rankingContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  rankCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  rankCardFirst: {
    backgroundColor: colors.warningBg,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  rankCardRest: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 0.5,
    borderColor: colors.border,
    opacity: 0.85,
  },
  rankCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rankAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rankAvatarText: { ...typography.captionMedium },
  rankName: { ...typography.bodyMedium, color: colors.textPrimary },
  rankPosition: { ...typography.caption, color: colors.textTertiary },
  rankScore: { ...typography.score, color: colors.textPrimary },
  turnPills: { flexDirection: "row", gap: spacing.sm },
  turnPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
    gap: 2,
  },
  turnPillFirst: { backgroundColor: colors.warning + "22" },
  turnPillLabel: { ...typography.micro, color: colors.textTertiary },
  turnPillScore: { ...typography.captionMedium, color: colors.textPrimary },
  buttons: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  rematchBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.bgPrimary,
  },
  rematchText: { ...typography.bodyMedium, color: colors.accent },
  newGameBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  newGameText: { ...typography.bodyMedium, color: colors.bgPrimary },
});
