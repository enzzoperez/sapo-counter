import type { GameState, TournamentState } from "@/types";

// The web viewer's schema uses Spanish enum values; our internal state is English.
const MODE_MAP = { turns: "turnos", goal: "meta" } as const;
const FORMAT_MAP = { individual: "individual", teams: "equipos" } as const;

/** GameState → plain object for Firebase (no undefined, no functions/refs). */
export function serializeGameState(state: GameState) {
  return {
    mode: MODE_MAP[state.mode],
    format: FORMAT_MAP[state.format],
    membersPerTeam: state.membersPerTeam,
    totalTurns: state.totalTurns ?? null,
    targetScore: state.targetScore ?? null,
    participants: state.participants.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color ?? null,
      members: p.members?.map((m) => ({ id: m.id, name: m.name })) ?? null,
      turns: p.turns,
    })),
    currentTurnIdx: state.currentTurnIdx,
    currentParticipantIdx: state.currentParticipantIdx,
    // In-progress team turn (so viewers can show partial progress).
    currentThrowIdx: state.currentThrowIdx,
    pendingTeamScores: state.pendingTeamScores ?? {},
    finished: state.finished,
  };
}

/** TournamentState → plain object for Firebase. */
export function serializeTournamentState(state: TournamentState) {
  return {
    players: state.players,
    rounds: state.rounds.map((round) =>
      round.map((match) => ({
        id: match.id,
        round: match.round,
        position: match.position,
        player1: match.player1
          ? {
              id: match.player1.id,
              name: match.player1.name,
              score: match.player1.score ?? null,
            }
          : null,
        player2: match.player2
          ? {
              id: match.player2.id,
              name: match.player2.name,
              score: match.player2.score ?? null,
            }
          : null,
        winnerId: match.winnerId ?? null,
        isBye: match.isBye,
      })),
    ),
    totalRounds: state.totalRounds,
    currentRound: state.currentRound,
    finished: state.finished,
    winnerId: state.winnerId ?? null,
  };
}
