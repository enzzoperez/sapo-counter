import { View, Text, StyleSheet, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme/theme";
import { PrimaryButton } from "@/components/shared/primary-button";
import { useTournament } from "@/state/tournament-context";

export function TournamentChampionScreen() {
  const router = useRouter();
  const { state, dispatch } = useTournament();
  const leaving = useRef(false);

  function backToSetup() {
    leaving.current = true;
    dispatch({ type: "RESET" });
    router.dismissAll();
  }

  // If there's no resolved tournament, bail back to setup
  useEffect(() => {
    if ((!state || !state.winnerId) && !leaving.current) {
      router.replace("/torneo");
    }
  }, [!!state, state?.winnerId]);

  // Android back → start a new tournament
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      backToSetup();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!state || !state.winnerId) return null;

  const finalMatch = state.rounds[state.totalRounds - 1][0];
  const winner = [finalMatch.player1, finalMatch.player2].find(
    (p) => p?.id === state.winnerId,
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.center}>
        <View style={styles.trophyBox}>
          <MaterialCommunityIcons name="trophy" size={36} color={colors.gold} />
        </View>
        <Text style={styles.micro}>CAMPEÓN</Text>
        <Text style={styles.name}>{winner?.name ?? ""}</Text>
        <Text style={styles.subtitle}>Ganó el torneo</Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton label="Nuevo torneo" onPress={backToSetup} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
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
  micro: { ...typography.micro, color: colors.textTertiary },
  name: { ...typography.heading, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textTertiary },
  bottom: {
    padding: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
