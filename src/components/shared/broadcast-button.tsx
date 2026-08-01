import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/theme";

type Props = { onPress: () => void };

/** Header "LIVE" indicator shown once the ShareBanner has been dismissed. */
export function BroadcastButton({ onPress }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4],
  });

  return (
    <TouchableOpacity style={styles.pill} onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <MaterialCommunityIcons
          name="broadcast"
          size={16}
          color={colors.danger}
        />
      </Animated.View>
      <Text style={styles.live}>VIVO</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 1,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 1,
  },
  live: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.danger,
  },
});
