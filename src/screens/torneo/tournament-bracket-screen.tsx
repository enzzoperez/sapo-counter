import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme/theme";
import { MatchCard } from "@/components/torneo/match-card";
import { RoundIndicator } from "@/components/torneo/round-indicator";
import { PrimaryButton } from "@/components/shared/primary-button";
import { isRoundComplete, roundName } from "@/tournament-helpers";
import { useTournament } from "@/state/tournament-context";

export function TournamentBracketScreen() {
  const router = useRouter();
  const { state, dispatch } = useTournament();
  const pushedToChampion = useRef(false);

  function discard() {
    Alert.alert("¿Descartar torneo?", "Se va a perder el bracket actual.", [
      { text: "Seguir", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => {
          dispatch({ type: "RESET" });
          router.back();
        },
      },
    ]);
  }

  // Navigate to champion when the final resolves
  useEffect(() => {
    if (state?.finished && !pushedToChampion.current) {
      pushedToChampion.current = true;
      router.push("/torneo/champion");
    } else if (!state?.finished) {
      pushedToChampion.current = false;
      if (!state) router.replace("/torneo");
    }
  }, [state?.finished, !!state]);

  // Android hardware back → discard confirmation
  useEffect(() => {
    if (!state || state.finished) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      discard();
      return true;
    });
    return () => sub.remove();
  }, [!!state, state?.finished]);

  if (!state) return null;

  const { rounds, totalRounds, currentRound } = state;
  const round = rounds[currentRound];
  const isFinal = currentRound === totalRounds - 1;
  const partidos = round.filter((m) => !m.isBye).length;
  const libres = round.filter((m) => m.isBye).length;
  const nextRoundLabel = roundName(currentRound + 1, totalRounds);

  const canPrev = currentRound > 0;
  const canNext = currentRound < totalRounds - 1;

  function goRound(delta: number) {
    dispatch({ type: "SET_ROUND", round: currentRound + delta });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={discard} style={styles.sideBtn}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <View style={styles.center} />
        <TouchableOpacity
          onPress={() => router.push("/torneo/llaves")}
          style={styles.llavesBtn}
        >
          <MaterialCommunityIcons
            name="sitemap-outline"
            size={16}
            color={colors.accent}
          />
          <Text style={styles.llavesText}>Llaves</Text>
        </TouchableOpacity>
      </View>

      {/* Round nav */}
      <View style={styles.roundNav}>
        <TouchableOpacity
          onPress={() => goRound(-1)}
          disabled={!canPrev}
          style={styles.sideBtn}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={canPrev ? colors.textSecondary : colors.textDisabled}
          />
        </TouchableOpacity>

        <View style={styles.roundInfo}>
          <Text style={styles.roundTitle}>
            {roundName(currentRound, totalRounds)}
          </Text>
          <Text style={styles.roundSubtitle}>
            {partidos} {partidos === 1 ? "partido" : "partidos"}
            {libres > 0 ? ` · ${libres} ${libres === 1 ? "libre" : "libres"}` : ""}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => goRound(1)}
          disabled={!canNext}
          style={styles.sideBtn}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={canNext ? colors.textSecondary : colors.textDisabled}
          />
        </TouchableOpacity>
      </View>

      <RoundIndicator total={totalRounds} current={currentRound} />

      {/* Matches */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.matches}
        showsVerticalScrollIndicator={false}
      >
        {round.map((match, matchIdx) => (
          <MatchCard
            key={match.id}
            match={match}
            isFinal={isFinal}
            nextRoundLabel={nextRoundLabel}
            onScoreChange={(slot, score) =>
              dispatch({
                type: "SET_SCORE",
                roundIdx: currentRound,
                matchIdx,
                slot,
                score,
              })
            }
          />
        ))}
      </ScrollView>

      {/* Advance to next round when the current one is fully decided */}
      {canNext && isRoundComplete(round) && (
        <View style={styles.bottom}>
          <PrimaryButton
            label="Siguiente ronda"
            onPress={() => goRound(1)}
            icon={
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={colors.accentDark}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  sideBtn: { width: 40, alignItems: "center" },
  center: { flex: 1 },
  llavesBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  llavesText: { ...typography.captionMedium, color: colors.accent },
  roundNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  roundInfo: { flex: 1, alignItems: "center", gap: 2 },
  roundTitle: { ...typography.title, color: colors.textPrimary },
  roundSubtitle: { ...typography.caption, color: colors.textTertiary },
  matches: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  bottom: {
    padding: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
