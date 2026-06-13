import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";

type Props = { name: string; onRemove: () => void };

export function PlayerChip({ name, onRemove }: Props) {
  return (
    <View style={styles.chip}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <Feather name="x" size={14} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: 13,
  },
  name: { ...typography.chip, color: colors.textPrimary },
});
