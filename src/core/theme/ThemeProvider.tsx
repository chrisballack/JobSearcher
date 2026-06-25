import { createContext, useState, useEffect, useCallback } from "react";
import { useColorScheme, StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "./colors";
import { Theme, ThemeMode } from "./types";

// ============================================================================
// Constants
// ============================================================================
const THEME_STORAGE_KEY = "@jobsearcher_theme";

// ============================================================================
// Context
// ============================================================================
interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

// ============================================================================
// Provider
// ============================================================================
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.warn("[Theme] Error loading saved theme:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const colors = isDark ? darkColors : lightColors;

  const theme: Theme = {
    mode: themeMode,
    colors,
    isDark,
  };

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn("[Theme] Error saving theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? "light" : "dark";
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.background);
    }
  }, [isDark, colors.background]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
