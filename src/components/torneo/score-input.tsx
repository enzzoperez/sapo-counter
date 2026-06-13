import { TextInput, StyleSheet } from "react-native";
import { colors, radius, typography, scoreInputSize } from "@/theme/theme";

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  /** Winner of a resolved match — accent border + text. */
  winner?: boolean;
  /** Guide attention to the empty input when the other score is loaded. */
  highlight?: boolean;
};

export function ScoreInput({ value, onChange, winner, highlight }: Props) {
  return (
    <TextInput
      style={[
        styles.input,
        winner && styles.winner,
        !winner && highlight && styles.highlight,
      ]}
      value={value == null ? "" : String(value)}
      onChangeText={(t) => {
        const digits = t.replace(/[^0-9]/g, "");
        onChange(digits === "" ? null : parseInt(digits, 10));
      }}
      keyboardType="number-pad"
      maxLength={6}
      placeholder="—"
      placeholderTextColor={colors.textDisabled}
      textAlign="center"
      selectTextOnFocus
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: scoreInputSize.width,
    height: scoreInputSize.height,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    ...typography.scoreInput,
    color: colors.textPrimary,
  },
  winner: { borderColor: colors.accentBorder, color: colors.accent },
  highlight: { borderColor: colors.gold },
});
