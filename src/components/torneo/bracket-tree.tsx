import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { roundName } from "@/tournament-helpers";
import type { Match, MatchPlayer } from "@/types";

type Props = { rounds: Match[][]; totalRounds: number };

function MiniRow({
  player,
  winnerId,
}: {
  player: MatchPlayer | null;
  winnerId: string | null;
}) {
  const isWinner = winnerId != null && player?.id === winnerId;
  const isLoser = winnerId != null && player != null && player.id !== winnerId;
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.name,
          !player && styles.placeholder,
          isWinner && styles.nameWinner,
          isLoser && styles.nameLoser,
        ]}
        numberOfLines={1}
      >
        {player?.name ?? "Por definir"}
      </Text>
      <Text style={[styles.score, isWinner && styles.scoreWinner]}>
        {player?.score ?? "—"}
      </Text>
    </View>
  );
}

function MiniMatch({ match }: { match: Match }) {
  if (match.isBye) {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text
            style={[styles.name, !match.player1 && styles.placeholder]}
            numberOfLines={1}
          >
            {match.player1?.name ?? "Por definir"}
          </Text>
          <Text style={styles.byeTag}>directo</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <MiniRow player={match.player1} winnerId={match.winnerId} />
      <View style={styles.separator} />
      <MiniRow player={match.player2} winnerId={match.winnerId} />
    </View>
  );
}

export function BracketTree({ rounds, totalRounds }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tree}
    >
      {rounds.map((round, r) => (
        <View key={r} style={styles.column}>
          <Text style={styles.columnTitle}>
            {roundName(r, totalRounds)}
          </Text>
          <View style={styles.columnMatches}>
            {round.map((m) => (
              <MiniMatch key={m.id} match={m} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const COLUMN_WIDTH = 168;

const styles = StyleSheet.create({
  tree: { padding: spacing.lg, gap: spacing.md },
  column: { width: COLUMN_WIDTH, gap: spacing.md },
  columnTitle: { ...typography.micro, color: colors.textTertiary },
  columnMatches: { gap: spacing.md },
  card: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  name: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  placeholder: { color: colors.textDisabled },
  nameWinner: { ...typography.captionMedium, color: colors.accent },
  nameLoser: { color: colors.textMuted },
  score: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  scoreWinner: { color: colors.accent },
  byeTag: { ...typography.micro, color: colors.gold },
  separator: { height: 1, backgroundColor: colors.border },
});
