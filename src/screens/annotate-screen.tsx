import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { Numpad } from "@/components/numpad";
import { useGame } from "@/state/game-context";

// null = untouched (shows "—"), string = digits entered (may be "0")
function applyInput(current: string, key: string): string {
  if (key === "00") {
    if (current === "0") return "0";
    const next = current + "00";
    return next.length > 4 ? current : next;
  }
  // Replace a lone leading zero with the new digit
  if (current === "0") return key;
  const next = current + key;
  return next.length > 4 ? current : next;
}

export function AnnotateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useGame();

  const [rawInput, setRawInput] = useState<string | null>(null);

  if (!state) {
    router.back();
    return null;
  }

  const { participants, currentParticipantIdx, currentThrowIdx, format } = state;
  const participant = participants[currentParticipantIdx];
  const currentMemberIdx =
    format === "teams"
      ? Math.floor(currentThrowIdx / participants.length)
      : 0;
  const currentMember =
    format === "teams" ? participant.members?.[currentMemberIdx] : null;

  const turnLabel = `TURNO ${state.currentTurnIdx + 1}`;
  const contextLabel = currentMember
    ? `${currentMember.name} · ${participant.name}`
    : participant.name;

  const accentColor = participant.color ?? colors.accent;
  const displayValue = rawInput ?? "—";
  const confirmDisabled = rawInput === null;

  function handleNumpadPress(key: string) {
    setRawInput((prev) => {
      if (prev === null) {
        // First press: "00" → "0", anything else → that digit
        return key === "00" ? "0" : key;
      }
      return applyInput(prev, key);
    });
  }

  function handleBackspace() {
    setRawInput((prev) => {
      if (prev === null) return null;
      if (prev.length <= 1) return null; // back to untouched
      return prev.slice(0, -1);
    });
  }

  function handleConfirm() {
    if (rawInput === null) return;
    dispatch({ type: "ANNOTATE_TURN", score: parseInt(rawInput, 10) || 0 });
    router.back();
  }

  return (
    <View style={styles.container}>
      {/* Header with safe area top */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerLabels}>
          <Text style={styles.headerMicro}>{turnLabel}</Text>
          <Text style={styles.headerName}>{contextLabel}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Total display */}
      <View style={styles.totalArea}>
        <Text style={styles.totalLabel}>TOTAL DEL TURNO</Text>
        <Text
          style={[
            styles.totalValue,
            rawInput === null && styles.totalValueEmpty,
            { color: rawInput !== null ? accentColor : colors.textTertiary },
          ]}
        >
          {displayValue}
        </Text>
      </View>

      {/* Fixed bottom: numpad + button */}
      <View
        style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Numpad onPress={handleNumpadPress} onBackspace={handleBackspace} />
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: accentColor },
            confirmDisabled && styles.confirmBtnDisabled,
          ]}
          onPress={handleConfirm}
          disabled={confirmDisabled}
        >
          <Text style={styles.confirmBtnText}>Confirmar turno</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 40 },
  headerLabels: { alignItems: "center", gap: 2 },
  headerMicro: { ...typography.micro, color: colors.textTertiary },
  headerName: { ...typography.bodyMedium, color: colors.textPrimary },
  totalArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  totalLabel: { ...typography.micro, color: colors.textTertiary },
  totalValue: { ...typography.display },
  totalValueEmpty: { ...typography.display },
  bottom: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bgPrimary,
  },
  confirmBtn: {
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  confirmBtnDisabled: { opacity: 0.35 },
  confirmBtnText: { ...typography.bodyMedium, color: colors.bgPrimary },
});
