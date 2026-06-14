import { Stack } from "expo-router";

export default function TorneoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="bracket" options={{ gestureEnabled: false }} />
      <Stack.Screen name="champion" options={{ gestureEnabled: false }} />
      <Stack.Screen name="llaves" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );
}
