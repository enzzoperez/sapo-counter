import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/theme/theme";
import { BracketTree } from "@/components/torneo/bracket-tree";
import { useTournament } from "@/state/tournament-context";

export function BracketViewScreen() {
  const router = useRouter();
  const { state } = useTournament();

  useEffect(() => {
    if (!state) router.back();
  }, [!!state]);

  if (!state) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Llaves</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={8}
        >
          <Feather name="x" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <BracketTree rounds={state.rounds} totalRounds={state.totalRounds} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  title: { ...typography.title, color: colors.textPrimary },
  closeBtn: { width: 32, alignItems: "flex-end" },
});
