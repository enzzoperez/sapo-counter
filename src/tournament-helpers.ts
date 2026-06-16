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

/** Descriptive round label (Final / Semifinales / Cuartos / Ronda N). Display only. */
export function roundName(roundIdx: number, totalRounds: number): string {
  const fromEnd = totalRounds - 1 - roundIdx;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semifinales";
  if (fromEnd === 2) return "Cuartos";
  return `Ronda ${roundIdx + 1}`;
}

/**
 * Single-elimination bracket with all byes in round 1. Pads to the next power of two;
 * the first `byes` round-1 slots are byes (one player advancing), the rest are real
 * 2-player matches. After round 1 exactly P/2 players remain → a clean power-of-two
 * bracket to the final, so nobody reaches later rounds without having played.
 */
export function generateBracket(players: string[]): TournamentState {
  const shuffled = shuffle(players);
  const n = shuffled.length;

  // Next power of two >= n, and the number of rounds to reach it.
  let size = 1;
  let totalRounds = 0;
  while (size < n) {
    size *= 2;
    totalRounds++;
  }
  const byes = size - n;
  const r1Cards = size / 2;

  const mk = (name: string): MatchPlayer => ({ id: genId(), name, score: null });

  // Round 1: the first `byes` cards are byes (single player), the rest real matches.
  let idx = 0;
  const round0: Match[] = [];
  for (let i = 0; i < r1Cards; i++) {
    const isBye = i < byes;
    const p1 = mk(shuffled[idx++]);
    const p2 = isBye ? null : mk(shuffled[idx++]);
    round0.push({
      id: genId(),
      round: 0,
      position: i,
      player1: p1,
      player2: p2,
      winnerId: isBye ? p1.id : null,
      isBye,
    });
  }

  // Clean power-of-two rounds after round 1.
  const rounds: Match[][] = [round0];
  for (let r = 1; r < totalRounds; r++) {
    const count = size / 2 ** (r + 1);
    rounds.push(
      Array.from({ length: count }, (_, i) => ({
        id: genId(),
        round: r,
        position: i,
        player1: null,
        player2: null,
        winnerId: null,
        isBye: false,
      })),
    );
  }

  // Propagate round-1 bye winners into round 2.
  let propagated = rounds;
  round0.forEach((m, i) => {
    if (m.isBye) propagated = propagate(propagated, 0, i);
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
