import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  activeColor?: string;
};

export function Pill({
  label,
  active,
  onPress,
  disabled,
  activeColor = colors.accent,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        active && { backgroundColor: activeColor, borderColor: activeColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgPrimary,
  },
  disabled: { opacity: 0.4 },
  label: { ...typography.bodyMedium, color: colors.textSecondary },
  labelActive: { color: colors.bgPrimary },
});
