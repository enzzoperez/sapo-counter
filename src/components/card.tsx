import { View, StyleSheet, type ViewStyle } from "react-native";
import { colors, spacing, radius } from "@/theme/theme";

type Props = { children: React.ReactNode; style?: ViewStyle };

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
});
