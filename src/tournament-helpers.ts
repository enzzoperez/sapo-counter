import type { Match, MatchPlayer, TournamentState } from "./types";
import { genId } from "./helpers";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Winner id of a match: bye → the present player; both scores set → higher (tie → player1). */
export function getMatchWinner(match: Match): string | null {
  if (match.isBye) return match.player1?.id ?? match.player2?.id ?? null;
  const { player1, player2 } = match;
  if (!player1 || !player2) return null;
  if (player1.score == null || player2.score == null) return null;
  return player1.score >= player2.score ? player1.id : player2.id;
}

/** Destination match + slot in the next round for a given match index. */
export function nextSlot(matchIdx: number): { matchIdx: number; slot: 1 | 2 } {
  return {
    matchIdx: Math.floor(matchIdx / 2),
    slot: matchIdx % 2 === 0 ? 1 : 2,
  };
}

export function isRoundComplete(round: Match[]): boolean {
  return round.every((m) => m.winnerId !== null);
}

function winnerName(match: Match, winnerId: string): string {
  if (match.player1?.id === winnerId) return match.player1.name;
  if (match.player2?.id === winnerId) return match.player2.name;
  return "";
}

/**
 * Recompute the winner of (roundIdx, matchIdx) from its scores and propagate the
 * result forward, clearing any downstream match whose occupant changed. Mutates `rounds`.
 */
function recompute(rounds: Match[][], roundIdx: number, matchIdx: number): void {
  const match = rounds[roundIdx][matchIdx];
  const winnerId = getMatchWinner(match);
  match.winnerId = winnerId;

  if (roundIdx === rounds.length - 1) return; // final, nothing downstream

  const { matchIdx: nIdx, slot } = nextSlot(matchIdx);
  const nextMatch = rounds[roundIdx + 1][nIdx];
  const slotKey = slot === 1 ? "player1" : "player2";

  const newOccupant: MatchPlayer | null =
    winnerId != null
      ? { id: winnerId, name: winnerName(match, winnerId), score: null }
      : null;

  const sameOccupant = (nextMatch[slotKey]?.id ?? null) === (newOccupant?.id ?? null);
  if (sameOccupant) return;

  // Occupant changed → reset the destination match entirely and recurse
  nextMatch[slotKey] = newOccupant;
  if (nextMatch.player1) nextMatch.player1 = { ...nextMatch.player1, score: null };
  if (nextMatch.player2) nextMatch.player2 = { ...nextMatch.player2, score: null };
  nextMatch.winnerId = null;

  recompute(rounds, roundIdx + 1, nIdx);
}

/** Deep-copies `rounds`, then recomputes + propagates from the given match. */
export function propagate(
  rounds: Match[][],
  roundIdx: number,
  matchIdx: number,
): Match[][] {
  const copy = rounds.map((r) => r.map((m) => ({ ...m })));
  recompute(copy, roundIdx, matchIdx);
  return copy;
}

/**
 * "Ladder" bracket: every round pairs participants two-by-two; if a round has an
 * odd count, the last participant gets a bye into the next round. So everyone plays
 * the first round and byes only appear where an odd count forces them.
 */
export function generateBracket(players: string[]): TournamentState {
  const shuffled = shuffle(players);
  const n = shuffled.length;

  // Participant count entering each round: c0 = n, c[r+1] = ceil(c[r] / 2) → 1.
  const counts = [n];
  while (counts[counts.length - 1] > 1) {
    counts.push(Math.ceil(counts[counts.length - 1] / 2));
  }
  const totalRounds = counts.length - 1; // rounds that hold matches

  const mk = (name: string): MatchPlayer => ({ id: genId(), name, score: null });

  const rounds: Match[][] = [];
  for (let r = 0; r < totalRounds; r++) {
    const incoming = counts[r];
    const cardCount = Math.ceil(incoming / 2);
    const oddBye = incoming % 2 === 1; // last card of this round is a bye
    const round: Match[] = [];
    for (let i = 0; i < cardCount; i++) {
      const isBye = oddBye && i === cardCount - 1;
      // Round 0 is seeded with the shuffled players; later rounds fill via propagation.
      const p1 = r === 0 && 2 * i < n ? mk(shuffled[2 * i]) : null;
      const p2 = r === 0 && 2 * i + 1 < n ? mk(shuffled[2 * i + 1]) : null;
      round.push({
        id: genId(),
        round: r,
        position: i,
        player1: p1,
        player2: p2,
        winnerId: isBye && p1 ? p1.id : null,
        isBye,
      });
    }
    rounds.push(round);
  }

  // Propagate any round-0 byes forward (chains through later byes automatically).
  let propagated = rounds;
  rounds[0].forEach((m, i) => {
    if (m.isBye && m.player1) propagated = propagate(propagated, 0, i);
  });

  const finalMatch = propagated[totalRounds - 1][0];
  return {
    players,
    rounds: propagated,
    totalRounds,
    currentRound: 0,
    finished: finalMatch.winnerId != null,
    winnerId: finalMatch.winnerId,
  };
}
