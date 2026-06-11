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
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, teamColors } from "@/theme/theme";
import { Pill } from "@/components/shared/pill";
import { PrimaryButton } from "@/components/shared/primary-button";
import { useGame } from "@/state/game-context";
import { genId } from "@/helpers";
import type { Format, Mode, Participant } from "@/types";

type PlayerDraft = { id: string; name: string };
type TeamDraft = { id: string; name: string; members: PlayerDraft[] };

function makePlayer(): PlayerDraft {
  return { id: genId(), name: "" };
}
function makeTeam(membersCount: number): TeamDraft {
  return {
    id: genId(),
    name: "",
    members: Array.from({ length: membersCount }, makePlayer),
  };
}

const TURNS_OPTIONS = [2, 3, 4, 5];
const TARGET_OPTIONS = [100, 200, 300, 500];
const MEMBERS_OPTIONS = [2, 3, 4];

export function SetupScreen() {
  const router = useRouter();
  const { dispatch } = useGame();

  const [format, setFormat] = useState<Format>("individual");
  const [membersPerTeam, setMembersPerTeam] = useState(2);
  const [customMembers, setCustomMembers] = useState("");
  const [showCustomMembers, setShowCustomMembers] = useState(false);

  const [players, setPlayers] = useState<PlayerDraft[]>([
    makePlayer(),
    makePlayer(),
  ]);
  const [teams, setTeams] = useState<TeamDraft[]>([makeTeam(2), makeTeam(2)]);

  const [mode, setMode] = useState<Mode>("turns");
  const [totalTurns, setTotalTurns] = useState(3);
  const [customTurns, setCustomTurns] = useState("");
  const [showCustomTurns, setShowCustomTurns] = useState(false);

  const [targetScore, setTargetScore] = useState(200);
  const [customTarget, setCustomTarget] = useState("");
  const [showCustomTarget, setShowCustomTarget] = useState(false);

  // Sync team members when membersPerTeam changes
  useEffect(() => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.members.length === membersPerTeam) return team;
        if (team.members.length < membersPerTeam) {
          const toAdd = membersPerTeam - team.members.length;
          return {
            ...team,
            members: [
              ...team.members,
              ...Array.from({ length: toAdd }, makePlayer),
            ],
          };
        }
        return { ...team, members: team.members.slice(0, membersPerTeam) };
      }),
    );
  }, [membersPerTeam]);

  function updatePlayer(idx: number, name: string) {
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, name } : p)));
  }
  function removePlayer(idx: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  }
  function addPlayer() {
    setPlayers((prev) => [...prev, makePlayer()]);
  }

  function updateTeamName(idx: number, name: string) {
    setTeams((prev) => prev.map((t, i) => (i === idx ? { ...t, name } : t)));
  }
  function updateMember(teamIdx: number, memberIdx: number, name: string) {
    setTeams((prev) =>
      prev.map((t, i) =>
        i === teamIdx
          ? {
              ...t,
              members: t.members.map((m, j) =>
                j === memberIdx ? { ...m, name } : m,
              ),
            }
          : t,
      ),
    );
  }
  function addTeam() {
    setTeams((prev) => [...prev, makeTeam(membersPerTeam)]);
  }
  function removeTeam(idx: number) {
    setTeams((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleStart() {
    const participants: Participant[] =
      format === "individual"
        ? players.map((p, i) => ({
            id: p.id,
            name: p.name.trim() || `Jugador ${i + 1}`,
            turns: [],
          }))
        : teams.map((t, i) => ({
            id: t.id,
            name: t.name.trim() || `Equipo ${i + 1}`,
            color: teamColors[i % teamColors.length],
            members: t.members.map((m, j) => ({
              id: m.id,
              name: m.name.trim() || `J${j + 1}`,
            })),
            turns: [],
          }));

    dispatch({
      type: "START_GAME",
      payload: {
        mode,
        format,
        membersPerTeam,
        totalTurns: mode === "turns" ? totalTurns : undefined,
        targetScore: mode === "goal" ? targetScore : undefined,
        participants,
      },
    });
    router.push("/game");
  }

  const canStart =
    format === "individual" ? players.length >= 2 : teams.length >= 2;

  return (
    <SafeAreaView style={styles.safe}>
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
                name="target"
                size={26}
                color={colors.accent}
              />
            </View>
            <Text style={styles.headerTitle}>Sapo Contador</Text>
            <Text style={styles.headerSubtitle}>Nueva partida</Text>
          </View>

          {/* Format toggle */}
          <Section label="Formato">
            <View style={styles.toggleRow}>
              <ToggleCard
                label="Individual"
                active={format === "individual"}
                onPress={() => setFormat("individual")}
              />
              <ToggleCard
                label="Por equipos"
                active={format === "teams"}
                onPress={() => setFormat("teams")}
              />
            </View>
          </Section>

          {/* Members per team */}
          {format === "teams" && (
            <Section label="Jugadores por equipo">
              <View style={styles.pillRow}>
                {MEMBERS_OPTIONS.map((n) => (
                  <Pill
                    key={n}
                    label={String(n)}
                    active={membersPerTeam === n && !showCustomMembers}
                    onPress={() => {
                      setMembersPerTeam(n);
                      setShowCustomMembers(false);
                    }}
                  />
                ))}
                <Pill
                  label="..."
                  active={showCustomMembers}
                  onPress={() => setShowCustomMembers(true)}
                />
              </View>
              {showCustomMembers && (
                <TextInput
                  style={styles.customInput}
                  value={customMembers}
                  onChangeText={(v) => {
                    setCustomMembers(v);
                    const n = parseInt(v, 10);
                    if (n >= 2) setMembersPerTeam(n);
                  }}
                  keyboardType="number-pad"
                  placeholder="Ej: 5"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />
              )}
            </Section>
          )}

          {/* Players or Teams */}
          {format === "individual" ? (
            <Section label="Jugadores">
              <View style={styles.listCard}>
                {players.map((p, i) => (
                  <View
                    key={p.id}
                    style={[styles.playerRow, i > 0 && styles.playerRowBorder]}
                  >
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarSmallText}>
                        {p.name.charAt(0).toUpperCase() || String(i + 1)}
                      </Text>
                    </View>
                    <TextInput
                      style={styles.nameInput}
                      value={p.name}
                      onChangeText={(v) => updatePlayer(i, v)}
                      placeholder={`Jugador ${i + 1}`}
                      placeholderTextColor={colors.textMuted}
                    />
                    {players.length > 2 && (
                      <TouchableOpacity onPress={() => removePlayer(i)}>
                        <Feather name="x" size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
                <Feather name="plus" size={16} color={colors.accent} />
                <Text style={styles.addBtnText}>Agregar jugador</Text>
              </TouchableOpacity>
            </Section>
          ) : (
            <Section label="Equipos">
              {teams.map((team, ti) => (
                <View
                  key={team.id}
                  style={[
                    styles.teamCard,
                    { borderLeftColor: teamColors[ti % teamColors.length] },
                  ]}
                >
                  <View style={styles.teamHeader}>
                    <TextInput
                      style={[styles.nameInput, styles.flex]}
                      value={team.name}
                      onChangeText={(v) => updateTeamName(ti, v)}
                      placeholder={`Equipo ${ti + 1}`}
                      placeholderTextColor={colors.textMuted}
                    />
                    {teams.length > 2 && (
                      <TouchableOpacity onPress={() => removeTeam(ti)}>
                        <Feather name="x" size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {team.members.map((m, mi) => (
                    <View key={m.id} style={styles.playerRow}>
                      <View
                        style={[
                          styles.avatarSmall,
                          {
                            backgroundColor:
                              teamColors[ti % teamColors.length] + "33",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.avatarSmallText,
                            { color: teamColors[ti % teamColors.length] },
                          ]}
                        >
                          {m.name.charAt(0).toUpperCase() || String(mi + 1)}
                        </Text>
                      </View>
                      <TextInput
                        style={[styles.nameInput, styles.flex]}
                        value={m.name}
                        onChangeText={(v) => updateMember(ti, mi, v)}
                        placeholder={`Jugador ${mi + 1}`}
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                  ))}
                </View>
              ))}
              <TouchableOpacity style={styles.addBtnDashed} onPress={addTeam}>
                <Feather name="plus" size={16} color={colors.accent} />
                <Text style={styles.addBtnText}>Agregar equipo</Text>
              </TouchableOpacity>
            </Section>
          )}

          {/* Game mode */}
          <Section label="Modo de juego">
            <View style={styles.toggleRow}>
              <ToggleCard
                label="Por turnos"
                active={mode === "turns"}
                onPress={() => setMode("turns")}
              />
              <ToggleCard
                label="Meta fija"
                active={mode === "goal"}
                onPress={() => setMode("goal")}
              />
            </View>
          </Section>

          {/* Turns count */}
          {mode === "turns" && (
            <Section label="Cantidad de turnos">
              <View style={styles.pillRow}>
                {TURNS_OPTIONS.map((n) => (
                  <Pill
                    key={n}
                    label={String(n)}
                    active={totalTurns === n && !showCustomTurns}
                    onPress={() => {
                      setTotalTurns(n);
                      setShowCustomTurns(false);
                    }}
                  />
                ))}
                <Pill
                  label="..."
                  active={showCustomTurns}
                  onPress={() => setShowCustomTurns(true)}
                />
              </View>
              {showCustomTurns && (
                <TextInput
                  style={styles.customInput}
                  value={customTurns}
                  onChangeText={(v) => {
                    setCustomTurns(v);
                    const n = parseInt(v, 10);
                    if (n >= 1) setTotalTurns(n);
                  }}
                  keyboardType="number-pad"
                  placeholder="Ej: 8"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />
              )}
            </Section>
          )}

          {/* Target score */}
          {mode === "goal" && (
            <Section label="Puntaje objetivo">
              <View style={styles.pillRow}>
                {TARGET_OPTIONS.map((n) => (
                  <Pill
                    key={n}
                    label={String(n)}
                    active={targetScore === n && !showCustomTarget}
                    onPress={() => {
                      setTargetScore(n);
                      setShowCustomTarget(false);
                    }}
                  />
                ))}
                <Pill
                  label="..."
                  active={showCustomTarget}
                  onPress={() => setShowCustomTarget(true)}
                />
              </View>
              {showCustomTarget && (
                <TextInput
                  style={styles.customInput}
                  value={customTarget}
                  onChangeText={(v) => {
                    setCustomTarget(v);
                    const n = parseInt(v, 10);
                    if (n >= 1) setTargetScore(n);
                  }}
                  keyboardType="number-pad"
                  placeholder="Ej: 750"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />
              )}
            </Section>
          )}

          <PrimaryButton
            label="Empezar partida"
            onPress={handleStart}
            disabled={!canStart}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function ToggleCard({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.toggleCard, active && styles.toggleCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.toggleCardLabel, active && styles.toggleCardLabelActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.xxl,
  },
  headerBlock: { alignItems: "center", gap: spacing.xs },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  headerTitle: { ...typography.heading, color: colors.textPrimary },
  headerSubtitle: { ...typography.caption, color: colors.textTertiary },
  section: { gap: spacing.md },
  sectionLabel: { ...typography.micro, color: colors.textTertiary },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  toggleRow: { flexDirection: "row", gap: spacing.sm },
  toggleCard: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
  },
  toggleCardActive: {
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentBg,
  },
  toggleCardLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  toggleCardLabelActive: { color: colors.accent },
  listCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  playerRowBorder: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  avatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { ...typography.captionMedium, color: colors.accent },
  nameInput: {
    flex: 1,
    height: 40,
    ...typography.itemName,
    color: colors.textPrimary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addBtnDashed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderSubtle,
  },
  addBtnText: { ...typography.bodyMedium, color: colors.accent },
  teamCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    padding: spacing.md,
    gap: spacing.sm,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  customInput: {
    height: 44,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
});
