import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GameProvider } from "@/state/game-context";
import { TournamentProvider } from "@/state/tournament-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GameProvider>
      <TournamentProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </TournamentProvider>
    </GameProvider>
  );
}
