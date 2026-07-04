import type { GameState } from "../types";
import type { GameSetup } from "../types";
import { isFinished, shuffle } from "../helpers";

export type Action =
  | { type: "START_GAME"; payload: GameSetup }
  | { type: "ANNOTATE_TURN"; score: number }
  | { type: "REMATCH" }
  | { type: "NEW_GAME" };

const FRESH_THROW_STATE = {
  currentThrowIdx: 0,
  pendingTeamScores: {} as Record<string, number[]>,
};

export function gameReducer(
  state: GameState | null,
  action: Action
): GameState | null {
  switch (action.type) {
    case "START_GAME":
      // Sorteo: randomize participant order (and member order within teams).
      return {
        ...action.payload,
        participants: shuffle(action.payload.participants).map((p) => ({
          ...p,
          turns: [],
          members: p.members ? shuffle(p.members) : p.members,
        })),
        currentTurnIdx: 0,
        currentParticipantIdx: 0,
        ...FRESH_THROW_STATE,
        finished: false,
      };

    case "ANNOTATE_TURN": {
      if (!state) return null;
      const {
        format,
        participants,
        currentParticipantIdx,
        currentTurnIdx,
        membersPerTeam,
      } = state;

      // ── Individual ──────────────────────────────────────────────────────
      if (format === "individual") {
        const newParticipants = participants.map((p, i) =>
          i === currentParticipantIdx
            ? { ...p, turns: [...p.turns, action.score] }
            : p
        );
        const nextIdx = (currentParticipantIdx + 1) % participants.length;
        const nextTurnIdx =
          nextIdx === 0 ? currentTurnIdx + 1 : currentTurnIdx;
        const newState: GameState = {
          ...state,
          participants: newParticipants,
          currentParticipantIdx: nextIdx,
          currentTurnIdx: nextTurnIdx,
        };
        return { ...newState, finished: isFinished(newState) };
      }

      // ── Teams: interleaved per-member throws ────────────────────────────
      // Throw order for N teams × M members:
      //   throwIdx 0       → team 0, member 0
      //   throwIdx 1       → team 1, member 0
      //   throwIdx N       → team 0, member 1
      //   throwIdx N*M - 1 → team N-1, member M-1  (round complete)
      const numTeams = participants.length;
      const throwIdx = state.currentThrowIdx;
      const teamIdx = throwIdx % numTeams;
      const memberIdx = Math.floor(throwIdx / numTeams);

      const currentTeam = participants[teamIdx];
      const pending = { ...state.pendingTeamScores };
      const teamPending = [...(pending[currentTeam.id] ?? []), action.score];
      pending[currentTeam.id] = teamPending;

      let newParticipants = participants;
      if (teamPending.length === membersPerTeam) {
        // All members of this team have thrown → commit turn
        newParticipants = participants.map((p, i) =>
          i === teamIdx ? { ...p, turns: [...p.turns, teamPending] } : p
        );
        delete pending[currentTeam.id];
      }

      const throwCycleLen = numTeams * membersPerTeam;
      const nextThrowIdx = throwIdx + 1;
      const roundComplete = nextThrowIdx >= throwCycleLen;

      const newState: GameState = {
        ...state,
        participants: newParticipants,
        currentParticipantIdx: roundComplete ? 0 : nextThrowIdx % numTeams,
        currentTurnIdx: roundComplete ? currentTurnIdx + 1 : currentTurnIdx,
        currentThrowIdx: roundComplete ? 0 : nextThrowIdx,
        pendingTeamScores: pending,
      };
      return { ...newState, finished: isFinished(newState) };
    }

    case "REMATCH":
      if (!state) return null;
      return {
        ...state,
        participants: state.participants.map((p) => ({ ...p, turns: [] })),
        currentTurnIdx: 0,
        currentParticipantIdx: 0,
        ...FRESH_THROW_STATE,
        finished: false,
      };

    case "NEW_GAME":
      return null;

    default:
      return state;
  }
}
