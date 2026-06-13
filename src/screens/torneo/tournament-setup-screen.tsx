import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { PlayerChip } from "@/components/torneo/player-chip";
import { PrimaryButton } from "@/components/shared/primary-button";
import { useTournament } from "@/state/tournament-context";

function roundsFor(n: number): number {
  let size = 1;
  while (size < n) size *= 2;
  return Math.max(1, Math.log2(size));
}

export function TournamentSetupScreen() {
  const router = useRouter();
  const { dispatch } = useTournament();

  const [input, setInput] = useState("");
  const [players, setPlayers] = useState<string[]>([]);

  function addPlayer() {
    const name = input.trim();
    if (!name) return;
    setPlayers((prev) => [...prev, name]);
    setInput("");
  }

  function removePlayer(idx: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleGenerate() {
    dispatch({ type: "GENERATE", players });
    router.push("/torneo/bracket");
  }

  const canGenerate = players.length >= 2;
  const rounds = canGenerate ? roundsFor(players.length) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBlock}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="trophy"
                size={26}
                color={colors.gold}
              />
            </View>
            <Text style={styles.headerTitle}>Nuevo torneo</Text>
            <Text style={styles.headerSubtitle}>Eliminación directa</Text>
          </View>

          {/* Player input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Nombre del jugador"
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={addPlayer}
              returnKeyType="done"
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={colors.accentDark}
              />
            </TouchableOpacity>
          </View>

          {/* Chips */}
          {players.length > 0 && (
            <View style={styles.chips}>
              {players.map((name, i) => (
                <PlayerChip
                  key={`${name}-${i}`}
                  name={name}
                  onRemove={() => removePlayer(i)}
                />
              ))}
            </View>
          )}

          {/* Info line */}
          <View style={styles.infoLine}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={15}
              color={colors.textTertiary}
            />
            <Text style={styles.infoText}>
              {players.length} jugadores
              {canGenerate ? ` · ${rounds} rondas · cruces al azar` : ""}
            </Text>
          </View>
        </ScrollView>

        {/* Fixed bottom action */}
        <View style={styles.bottom}>
          <PrimaryButton
            label="Generar torneo"
            onPress={handleGenerate}
            disabled={!canGenerate}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.xl },
  headerBlock: { alignItems: "center", gap: spacing.xs },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  headerTitle: { ...typography.heading, color: colors.textPrimary },
  headerSubtitle: { ...typography.caption, color: colors.textTertiary },
  inputRow: { flexDirection: "row", gap: spacing.sm },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...typography.itemName,
    color: colors.textPrimary,
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  infoLine: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  infoText: { ...typography.caption, color: colors.textTertiary },
  bottom: {
    padding: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
