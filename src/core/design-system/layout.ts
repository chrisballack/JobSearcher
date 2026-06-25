export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 16,
  "3xl": 20,
  full: 9999,
} as const;

export const tabBar = {
  ios: {
    height: 88,
    paddingBottom: 28,
  },
  android: {
    height: 64,
    paddingBottom: 8,
  },
  paddingTop: 8,
  borderTopWidth: 0,
} as const;

export const header = {
  titleFontSize: 17,
  titleFontWeight: "600" as const,
} as const;

export const shadow = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 80,
} as const;

export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadow;
export type IconSize = keyof typeof iconSize;
