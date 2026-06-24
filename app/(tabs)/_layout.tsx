import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "#6200ee",
        },
        headerTintColor: Platform.OS === "ios" ? "#000" : "#fff",
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "#6200ee",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="jobs/index"
        options={{
          title: "Empleos",
          href: "/jobs",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favoritos",
          href: "/favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
