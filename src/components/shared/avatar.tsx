import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/theme/theme";

type Props = {
  name: string;
  /** Team color override — tints the avatar with the team color. */
  color?: string;
  active?: boolean;
  size?: number;
};

export function Avatar({ name, color, active = false, size = 36 }: Props) {
  let bg: string;
  let fg: string;
  if (color) {
    bg = color + "33";
    fg = color;
  } else if (active) {
    bg = colors.accent;
    fg = colors.accentDark;
  } else {
    bg = colors.bg;
    fg = colors.textSecondary;
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { color: fg }]}>
        {name.charAt(0).toUpperCase() || "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: "center", justifyContent: "center" },
  text: { ...typography.subtitle, fontWeight: "600" },
});
