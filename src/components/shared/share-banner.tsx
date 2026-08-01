import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";

type Props = {
  variant: "contador" | "torneo";
  onShare: () => void;
  onDismiss: () => void;
};

export function ShareBanner({ variant, onShare, onDismiss }: Props) {
  const text =
    variant === "contador"
      ? "Que otros vean los puntajes en vivo"
      : "Que otros vean el torneo en vivo";

  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons name="broadcast" size={20} color={colors.accent} />
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
      <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
        <Text style={styles.shareBtnText}>Compartir</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDismiss} hitSlop={8}>
        <Feather name="x" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accentBg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.accentBorder,
  },
  text: { ...typography.captionMedium, color: colors.accent, flex: 1 },
  shareBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  shareBtnText: { fontSize: 12, fontWeight: "600", color: colors.accentDark },
});
