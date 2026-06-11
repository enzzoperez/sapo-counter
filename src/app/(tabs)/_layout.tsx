import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography } from "@/theme/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: typography.tabLabel,
      }}
    >
      <Tabs.Screen
        name="(contador)"
        options={{
          title: "Contador",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calculator-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="torneo"
        options={{
          title: "Torneo",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tournament" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
