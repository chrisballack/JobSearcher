import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { fontSize, fontWeight, tabBar } from "@/core/design-system";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const platformTabBar = Platform.OS === "ios" ? tabBar.ios : tabBar.android;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          fontWeight: fontWeight.semibold,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: tabBar.borderTopWidth,
          elevation: 0,
          height: platformTabBar.height,
          paddingBottom: platformTabBar.paddingBottom,
          paddingTop: tabBar.paddingTop,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="jobs/index"
        options={{
          title: t("tabs.jobs"),
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
          title: t("tabs.favorites"),
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
