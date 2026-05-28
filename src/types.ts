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
