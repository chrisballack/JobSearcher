import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import "@/core/i18n";
import { ThemeProvider, useTheme } from "@/core/theme";
import { fontWeight } from "@/core/design-system";
import { Config } from "@/core/constants/Config";

// ============================================================================
// QueryClient singleton
// ============================================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Config.QUERY.RETRY,
      staleTime: Config.QUERY.STALE_TIME,
      refetchOnWindowFocus: Config.QUERY.REFETCH_ON_WINDOW_FOCUS,
    },
  },
});

// ============================================================================
// Themed Stack
// ============================================================================
function ThemedStack() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="detail/[id]"
          options={{
            headerShown: true,
            title: t("jobDetail.title"),
            headerBackTitle: t("common.back"),
            headerStyle: {
              backgroundColor: theme.colors.headerBackground,
            },
            headerTintColor: theme.colors.headerText,
            headerTitleStyle: {
              fontWeight: fontWeight.semibold,
            },
          }}
        />
      </Stack>
    </>
  );
}

// ============================================================================
// Root layout
// ============================================================================
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemedStack />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
