import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, teamColors } from "@/theme/theme";

type Props = {
  visible: boolean;
  teams: string[][];
  onResortear: () => void;
  onEmpezar: () => void;
  onClose: () => void;
};

export function SorteoResultSheet({
  visible,
  teams,
  onResortear,
  onEmpezar,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const isGrid = teams.length >= 4;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
          onPress={() => {}}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>¡Equipos sorteados!</Text>

          <View style={styles.teams}>
            {teams.map((team, idx) => (
              <View
                key={idx}
                style={[
                  styles.teamCard,
                  isGrid ? styles.teamCardGrid : styles.teamCardRow,
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: teamColors[idx % teamColors.length] },
                  ]}
                />
                <Text style={styles.teamLabel}>Equipo {idx + 1}</Text>
                {team.map((name, mIdx) => (
                  <Text
                    key={mIdx}
                    style={mIdx === 0 ? styles.memberFirst : styles.member}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onResortear}>
              <MaterialCommunityIcons
                name="shuffle-variant"
                size={18}
                color={colors.textPrimary}
              />
              <Text style={styles.secondaryLabel}>Re-sortear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={onEmpezar}>
              <Text style={styles.primaryLabel}>Empezar</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={colors.accentDark}
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  teams: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  teamCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.sm + 2,
    alignItems: "center",
    gap: spacing.xs,
  },
  teamCardRow: { flex: 1 },
  teamCardGrid: { width: "47%" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  teamLabel: { ...typography.captionMedium, color: colors.textSecondary },
  memberFirst: { ...typography.bodyMedium, color: colors.textPrimary },
  member: { ...typography.body, color: colors.textSecondary },
  actions: {
    flexDirection: "row",
    gap: spacing.sm + 2,
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  secondaryLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  primaryLabel: { ...typography.bodyMedium, color: colors.accentDark },
});
