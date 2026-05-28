import React, { createContext, useContext, useReducer } from "react";
import type { GameState } from "../types";
import { gameReducer, type Action } from "./game-reducer";

type GameContextType = {
  state: GameState | null;
  dispatch: React.Dispatch<Action>;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
