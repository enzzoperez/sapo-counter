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
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography, teamColors } from "@/theme/theme";
import { Pill } from "@/components/pill";
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

  const [players, setPlayers] = useState<PlayerDraft[]>([makePlayer(), makePlayer()]);
  const [teams, setTeams] = useState<TeamDraft[]>([
    makeTeam(2),
    makeTeam(2),
  ]);

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
      })
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
    setTeams((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, name } : t))
    );
  }
  function updateMember(teamIdx: number, memberIdx: number, name: string) {
    setTeams((prev) =>
      prev.map((t, i) =>
        i === teamIdx
          ? {
              ...t,
              members: t.members.map((m, j) =>
                j === memberIdx ? { ...m, name } : m
              ),
            }
          : t
      )
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
        >
          <Text style={styles.title}>Nueva partida</Text>

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
                  placeholderTextColor={colors.textTertiary}
                  autoFocus
                />
              )}
            </Section>
          )}

          {/* Players or Teams */}
          {format === "individual" ? (
            <Section label="Jugadores">
              {players.map((p, i) => (
                <View key={p.id} style={styles.playerRow}>
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
                    placeholderTextColor={colors.textTertiary}
                  />
                  {players.length > 2 && (
                    <TouchableOpacity onPress={() => removePlayer(i)}>
                      <Feather name="x" size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
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
                    {
                      borderLeftColor:
                        teamColors[ti % teamColors.length],
                    },
                  ]}
                >
                  <View style={styles.teamHeader}>
                    <TextInput
                      style={[styles.nameInput, styles.flex]}
                      value={team.name}
                      onChangeText={(v) => updateTeamName(ti, v)}
                      placeholder={`Equipo ${ti + 1}`}
                      placeholderTextColor={colors.textTertiary}
                    />
                    {teams.length > 2 && (
                      <TouchableOpacity onPress={() => removeTeam(ti)}>
                        <Feather
                          name="x"
                          size={18}
                          color={colors.textTertiary}
                        />
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
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                  ))}
                </View>
              ))}
              <TouchableOpacity style={styles.addBtn} onPress={addTeam}>
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
                  placeholderTextColor={colors.textTertiary}
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
                  placeholderTextColor={colors.textTertiary}
                  autoFocus
                />
              )}
            </Section>
          )}

          <TouchableOpacity
            style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
            onPress={handleStart}
            disabled={!canStart}
          >
            <Text style={styles.startBtnText}>Empezar partida</Text>
          </TouchableOpacity>
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
        style={[
          styles.toggleCardLabel,
          active && styles.toggleCardLabelActive,
        ]}
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
  title: { ...typography.title, color: colors.textPrimary },
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
    backgroundColor: colors.bgPrimary,
    alignItems: "center",
  },
  toggleCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentBg,
  },
  toggleCardLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  toggleCardLabelActive: { color: colors.accentText },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { ...typography.captionMedium, color: colors.accentText },
  nameInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addBtnText: { ...typography.bodyMedium, color: colors.accent },
  teamCard: {
    backgroundColor: colors.bgPrimary,
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
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  startBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  startBtnDisabled: { backgroundColor: colors.disabled },
  startBtnText: { ...typography.bodyMedium, color: colors.bgPrimary },
});
