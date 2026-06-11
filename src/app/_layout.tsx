import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GameProvider } from "@/state/game-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="game"
          options={{
            gestureEnabled: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="annotate"
          options={{ presentation: "modal", gestureEnabled: true }}
        />
        <Stack.Screen name="final" />
      </Stack>
    </GameProvider>
  );
}
