export type Mode = "turns" | "goal";
export type Format = "individual" | "teams";

export type Player = { id: string; name: string };

export type TurnScore = number | number[];

export type Participant = {
  id: string;
  name: string;
  color?: string;
  members?: Player[];
  turns: TurnScore[];
};

export type GameState = {
  mode: Mode;
  format: Format;
  membersPerTeam: number;
  totalTurns?: number;
  targetScore?: number;
  participants: Participant[];
  currentTurnIdx: number;
  currentParticipantIdx: number;
  // Teams only: position within the interleaved throw cycle
  currentThrowIdx: number;
  // Teams only: partial member scores for in-progress team turns
  pendingTeamScores: Record<string, number[]>;
  finished: boolean;
};

export type GameSetup = Pick<
  GameState,
  "mode" | "format" | "membersPerTeam" | "totalTurns" | "targetScore" | "participants"
>;

// ── Torneo (eliminación directa) ──────────────────────────────────────────

export type MatchPlayer = {
  id: string;
  name: string;
  score: number | null; // null = sin anotar
};

export type Match = {
  id: string;
  round: number; // 0-indexed
  position: number; // posición dentro de la ronda
  player1: MatchPlayer | null;
  player2: MatchPlayer | null;
  winnerId: string | null;
  isBye: boolean;
};

export type TournamentState = {
  players: string[];
  rounds: Match[][]; // rounds[0] = primera ronda
  totalRounds: number;
  currentRound: number; // ronda visible
  finished: boolean;
  winnerId: string | null;
};
