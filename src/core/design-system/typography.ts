export const fontSize = {
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 22,
  "4xl": 24,
} as const;

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
