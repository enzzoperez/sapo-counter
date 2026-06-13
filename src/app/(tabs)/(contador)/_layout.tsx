import { Stack } from "expo-router";

export default function ContadorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="game"
        options={{ gestureEnabled: false, headerBackButtonMenuEnabled: false }}
      />
      <Stack.Screen
        name="annotate"
        options={{ presentation: "fullScreenModal", gestureEnabled: true }}
      />
      <Stack.Screen name="final" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
