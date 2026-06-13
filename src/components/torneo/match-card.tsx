import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/theme/theme";
import { ScoreInput } from "./score-input";
import type { Match, MatchPlayer } from "@/types";

type Props = {
  match: Match;
  /** Label of the round the winner advances to (e.g. "Ronda 2"). */
  nextRoundLabel: string;
  isFinal: boolean;
  onScoreChange: (slot: 1 | 2, score: number | null) => void;
};

function PlayerRow({
  player,
  isWinner,
  isLoser,
  showInput,
  highlight,
  onChange,
}: {
  player: MatchPlayer | null;
  isWinner: boolean;
  isLoser: boolean;
  showInput: boolean;
  highlight: boolean;
  onChange: (v: number | null) => void;
}) {
  return (
    <View style={[styles.row, isWinner && styles.rowWinner]}>
      <Text
        style={[
          styles.name,
          !player && styles.namePlaceholder,
          isWinner && styles.nameWinner,
          isLoser && styles.nameLoser,
        ]}
        numberOfLines={1}
      >
        {player ? player.name : "Por definir"}
      </Text>
      {showInput && player && (
        <ScoreInput
          value={player.score}
          onChange={onChange}
          winner={isWinner}
          highlight={highlight}
        />
      )}
    </View>
  );
}

export function MatchCard({ match, nextRoundLabel, isFinal, onScoreChange }: Props) {
  const { player1: p1, player2: p2, winnerId, isBye } = match;

  // ── Bye ───────────────────────────────────────────────────────────────
  if (isBye) {
    return (
      <View style={[styles.card, styles.cardBye]}>
        <View style={styles.byeRow}>
          <Text
            style={[styles.byeName, !p1 && styles.byeNamePlaceholder]}
            numberOfLines={1}
          >
            {p1?.name ?? "Por definir"}
          </Text>
          <View style={styles.byeBadge}>
            <Text style={styles.byeBadgeText}>Pasa directo</Text>
          </View>
        </View>
      </View>
    );
  }

  const defined = winnerId != null;
  const showInput = p1 != null && p2 != null;
  const oneLoaded =
    showInput && (p1!.score == null) !== (p2!.score == null);

  const p1Winner = defined && winnerId === p1?.id;
  const p2Winner = defined && winnerId === p2?.id;
  const winnerNameStr = p1Winner ? p1!.name : p2Winner ? p2!.name : "";

  return (
    <View style={styles.card}>
      {/* Status label */}
      <View style={styles.statusRow}>
        <Text style={defined ? styles.statusDefined : styles.statusPending}>
          {defined ? "Definido" : "Pendiente"}
        </Text>
      </View>

      <PlayerRow
        player={p1}
        isWinner={p1Winner}
        isLoser={defined && !p1Winner}
        showInput={showInput}
        highlight={oneLoaded && p1!.score == null}
        onChange={(v) => onScoreChange(1, v)}
      />
      <View style={styles.separator} />
      <PlayerRow
        player={p2}
        isWinner={p2Winner}
        isLoser={defined && !p2Winner}
        showInput={showInput}
        highlight={oneLoaded && p2!.score == null}
        onChange={(v) => onScoreChange(2, v)}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {defined ? (
          isFinal ? (
            <Text style={styles.footerDefined}>
              🏆 {winnerNameStr} gana el torneo
            </Text>
          ) : (
            <Text style={styles.footerDefined}>
              ↑ Pasa {winnerNameStr} a {nextRoundLabel}
            </Text>
          )
        ) : (
          <Text style={styles.footerPending}>
            Anotá los puntajes — el ganador pasa solo
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  cardBye: { opacity: 0.85 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  statusDefined: { ...typography.micro, color: colors.accent },
  statusPending: { ...typography.micro, color: colors.gold },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  rowWinner: { borderLeftColor: colors.accent },
  name: { ...typography.itemName, color: colors.textPrimary, flex: 1 },
  namePlaceholder: { color: colors.textDisabled },
  nameWinner: { color: colors.accent },
  nameLoser: { color: colors.textMuted },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgSunken,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerDefined: { ...typography.caption, color: colors.accent },
  footerPending: { ...typography.caption, color: colors.textTertiary },
  // Bye
  byeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: spacing.lg,
  },
  byeName: { ...typography.itemName, color: colors.textSecondary, flex: 1 },
  byeNamePlaceholder: { color: colors.textDisabled },
  byeBadge: {
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  byeBadgeText: { ...typography.caption, color: colors.gold },
});
