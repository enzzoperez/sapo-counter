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

export function SecondaryButton({
  label,
  onPress,
  disabled,
  icon,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.btnDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  btnDisabled: { opacity: 0.4 },
  label: { ...typography.bodyMedium, color: colors.textPrimary },
});
