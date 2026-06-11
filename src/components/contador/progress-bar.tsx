import { View, StyleSheet } from "react-native";
import { colors, radius } from "@/theme/theme";

type Props = { value: number; max: number; color?: string };

export function ProgressBar({ value, max, color = colors.accent }: Props) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${pct * 100}%` as `${number}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.pill },
});
