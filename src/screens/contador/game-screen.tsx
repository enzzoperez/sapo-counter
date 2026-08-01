import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme/theme";
import { ParticipantCard } from "@/components/contador/participant-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { ShareBanner } from "@/components/shared/share-banner";
import { ShareBottomSheet } from "@/components/shared/share-bottom-sheet";
import { BroadcastButton } from "@/components/shared/broadcast-button";
import { useGame } from "@/state/game-context";
import { totalScore } from "@/helpers";
import { generateRoomCode } from "@/utils/room-code";

export function GameScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  // Prevents pushing /final multiple times while GameScreen is in background
  const pushedToFinal = useRef(false);

  // Live-share UI (mocked, no backend)
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [roomCode] = useState(generateRoomCode);

  function showAbandonAlert() {
    Alert.alert("¿Salir de la partida?", "Vas a perder el progreso actual.", [
      { text: "Seguir jugando", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => {
          dispatch({ type: "NEW_GAME" });
          router.replace("/");
        },
      },
    ]);
  }

  useEffect(() => {
    if (state?.finished && !pushedToFinal.current) {
      pushedToFinal.current = true;
      router.push("/final");
    } else if (!state?.finished) {
      pushedToFinal.current = false;
      if (!state) router.replace("/");
    }
  }, [state?.finished, !!state]);

  // Android: intercepta el botón físico de back
  useEffect(() => {
    if (!state || state.finished) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      showAbandonAlert();
      return true;
    });
    return () => sub.remove();
  }, [!!state, state?.finished]);

  if (!state) return null;

  const {
    participants,
    currentParticipantIdx,
    currentTurnIdx,
    currentThrowIdx,
    format,
    mode,
    totalTurns,
    targetScore,
  } = state;

  const activeParticipant = participants[currentParticipantIdx];
  const currentMemberIdx =
    format === "teams" ? Math.floor(currentThrowIdx / participants.length) : 0;
  const currentMember =
    format === "teams" ? activeParticipant.members?.[currentMemberIdx] : null;

  function handleAnnotate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    router.push("/annotate");
  }

  const annotateLabel = currentMember
    ? `Anotar: ${currentMember.name} · ${activeParticipant.name}`
    : `Anotar turno de ${activeParticipant.name}`;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSideBtn}
          onPress={showAbandonAlert}
        >
          <Feather name="arrow-left" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {mode === "turns" ? (
            <View style={styles.headerInfo}>
              <Text style={styles.micro}>TURNO</Text>
              <Text style={styles.headerValue}>
                {currentTurnIdx + 1}{" "}
                <Text style={styles.headerValueMuted}>/ {totalTurns}</Text>
              </Text>
            </View>
          ) : (
            <View style={styles.headerInfo}>
              <MaterialCommunityIcons
                name="flag"
                size={14}
                color={colors.textTertiary}
              />
              <Text style={styles.headerValue}>META {targetScore} pts</Text>
            </View>
          )}
        </View>
        {bannerDismissed ? (
          <BroadcastButton onPress={() => setShareSheetVisible(true)} />
        ) : (
          <View style={styles.headerSideBtn} />
        )}
      </View>

      {/* Live-share banner */}
      {!bannerDismissed && (
        <ShareBanner
          variant="contador"
          onShare={() => {
            setBannerDismissed(true);
            setShareSheetVisible(true);
          }}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Cards */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
      >
        {participants.map((p, i) => (
          <ParticipantCard
            key={p.id}
            participant={p}
            isActive={i === currentParticipantIdx}
            pendingScores={state.pendingTeamScores[p.id]}
            onAnnotate={handleAnnotate}
            mode={mode}
            target={targetScore}
            totalTurns={totalTurns}
            currentTurnIdx={currentTurnIdx}
          />
        ))}
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.bottom}>
        <PrimaryButton label={annotateLabel} onPress={handleAnnotate} />
        {mode === "goal" && targetScore != null && (
          <Text style={styles.goalHint}>
            Le faltan {Math.max(0, targetScore - totalScore(activeParticipant))}{" "}
            pts a {currentMember?.name ?? activeParticipant.name} para ganar
          </Text>
        )}
      </View>

      <ShareBottomSheet
        visible={shareSheetVisible}
        onClose={() => setShareSheetVisible(false)}
        roomCode={roomCode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
  },
  headerSideBtn: { width: 40, alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerInfo: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  micro: { ...typography.micro, color: colors.textTertiary },
  headerValue: {
    ...typography.title,
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  headerValueMuted: { color: colors.textMuted },
  cards: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  bottom: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  goalHint: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
