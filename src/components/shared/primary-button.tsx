import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, disabled, icon, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.btnDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {icon}
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  btnDisabled: { backgroundColor: colors.disabled },
  label: { ...typography.bodyMedium, color: colors.accentDark },
  labelDisabled: { color: colors.disabledText },
});
