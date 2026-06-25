import { Colors } from "./colors";

export type ThemeMode = "light" | "dark" | "system";

export interface Theme {
  mode: ThemeMode;
  colors: Colors;
  isDark: boolean;
}
