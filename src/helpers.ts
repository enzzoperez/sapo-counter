import type { Participant, TurnScore, GameState } from "./types";

export function turnScore(t: TurnScore): number {
  if (Array.isArray(t)) return t.reduce((a, b) => a + b, 0);
  return t;
}

export function totalScore(p: Participant): number {
  return p.turns.reduce<number>((sum, t) => sum + turnScore(t), 0);
}

export function isFinished(state: GameState): boolean {
  const { mode, participants, totalTurns, targetScore } = state;
  if (mode === "turns") {
    return participants.every((p) => p.turns.length === totalTurns);
  }
  const counts = participants.map((p) => p.turns.length);
  const allSame =
    counts.length > 0 && counts[0] > 0 && counts.every((c) => c === counts[0]);
  const someoneReached = participants.some((p) => totalScore(p) >= targetScore!);
  return allSame && someoneReached;
}

export function getWinner(
  participants: Participant[]
): Participant | Participant[] {
  const sorted = [...participants].sort((a, b) => totalScore(b) - totalScore(a));
  const topScore = totalScore(sorted[0]);
  const winners = sorted.filter((p) => totalScore(p) === topScore);
  return winners.length === 1 ? winners[0] : winners;
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}
