import React, { createContext, useContext, useReducer } from "react";
import type { TournamentState } from "../types";
import { tournamentReducer, type TournamentAction } from "./tournament-reducer";

type TournamentContextType = {
  state: TournamentState | null;
  dispatch: React.Dispatch<TournamentAction>;
};

const TournamentContext = createContext<TournamentContextType | null>(null);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tournamentReducer, null);
  return (
    <TournamentContext.Provider value={{ state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx)
    throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}
