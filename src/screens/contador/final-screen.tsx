import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { Avatar } from "@/components/shared/avatar";
import { PrimaryButton } from "@/components/shared/primary-button";
import { SecondaryButton } from "@/components/shared/secondary-button";
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
        <View style={styles.trophyBox}>
          <MaterialCommunityIcons
            name="trophy"
            size={36}
            color={colors.gold}
          />
        </View>
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
                  {isFirst && !p.color ? (
                    <View style={styles.goldAvatar}>
                      <Text style={styles.goldAvatarText}>
                        {p.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <Avatar name={p.name} color={p.color} />
                  )}
                  <View>
                    <Text
                      style={[
                        styles.rankName,
                        isFirst && { color: colors.gold },
                      ]}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={[
                        styles.rankPosition,
                        isFirst && { color: colors.gold },
                      ]}
                    >
                      {rank}° puesto
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.rankScore, isFirst && { color: colors.gold }]}
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
                  <View key={i} style={styles.turnPill}>
                    <Text style={styles.turnPillLabel}>T{i + 1}</Text>
                    <Text style={styles.turnPillScore}>{turnScore(t)}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <SecondaryButton
          label="Revancha"
          onPress={handleRematch}
          style={styles.btnFlex}
          icon={<Feather name="refresh-cw" size={16} color={colors.textPrimary} />}
        />
        <PrimaryButton
          label="Nueva partida"
          onPress={handleNewGame}
          style={styles.btnFlex}
          icon={<Feather name="home" size={16} color={colors.accentDark} />}
        />
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
  trophyBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  winnerMicro: { ...typography.micro, color: colors.textTertiary },
  winnerName: { ...typography.heading, color: colors.textPrimary },
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
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  rankCardRest: {
    backgroundColor: colors.bgElevated,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  rankCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  goldAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldBg,
    alignItems: "center",
    justifyContent: "center",
  },
  goldAvatarText: { ...typography.subtitle, fontWeight: "600", color: colors.gold },
  rankName: { ...typography.itemName, color: colors.textPrimary },
  rankPosition: { ...typography.caption, color: colors.textTertiary },
  rankScore: {
    ...typography.score,
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  turnPills: { flexDirection: "row", gap: spacing.sm },
  turnPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: "center",
    gap: 2,
  },
  turnPillLabel: { ...typography.micro, color: colors.textTertiary },
  turnPillScore: { ...typography.scoreSmall, color: colors.textPrimary },
  buttons: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  btnFlex: { flex: 1 },
});
