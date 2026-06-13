import type { TournamentState } from "../types";
import { generateBracket, propagate } from "../tournament-helpers";

export type TournamentAction =
  | { type: "GENERATE"; players: string[] }
  | {
      type: "SET_SCORE";
      roundIdx: number;
      matchIdx: number;
      slot: 1 | 2;
      score: number | null;
    }
  | { type: "SET_ROUND"; round: number }
  | { type: "RESET" };

export function tournamentReducer(
  state: TournamentState | null,
  action: TournamentAction,
): TournamentState | null {
  switch (action.type) {
    case "GENERATE":
      return generateBracket(action.players);

    case "SET_SCORE": {
      if (!state) return state;
      const { roundIdx, matchIdx, slot, score } = action;
      const rounds = state.rounds.map((r) => r.map((m) => ({ ...m })));
      const match = rounds[roundIdx][matchIdx];
      const slotKey = slot === 1 ? "player1" : "player2";
      const player = match[slotKey];
      if (!player) return state; // can't score an empty slot

      match[slotKey] = { ...player, score };
      const newRounds = propagate(rounds, roundIdx, matchIdx);
      const finalMatch = newRounds[newRounds.length - 1][0];
      return {
        ...state,
        rounds: newRounds,
        finished: finalMatch.winnerId != null,
        winnerId: finalMatch.winnerId,
      };
    }

    case "SET_ROUND": {
      if (!state) return state;
      const round = Math.max(0, Math.min(action.round, state.totalRounds - 1));
      return { ...state, currentRound: round };
    }

    case "RESET":
      return null;

    default:
      return state;
  }
}
