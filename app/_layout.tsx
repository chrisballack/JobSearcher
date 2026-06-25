import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, StatusBar } from "react-native";
import "@/core/i18n";
import { ThemeProvider, useTheme } from "@/core/theme";

// ============================================================================
// QueryClient singleton
// ============================================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemedStack() {
  const { theme } = useTheme();

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
            title: "Detalle del Empleo",
            headerBackTitle: "Volver",
            headerStyle: {
              backgroundColor: theme.colors.headerBackground,
            },
            headerTintColor: theme.colors.headerText,
            headerTitleStyle: {
              fontWeight: "600",
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
