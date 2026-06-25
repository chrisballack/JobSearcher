export const spacing = {
  // Micro spacing (2-8px)
  xs: 4,
  sm: 8,
  md: 12,

  // Regular spacing (12-24px)
  base: 16,
  lg: 20,
  xl: 24,

  // Large spacing (32-64px)
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
} as const;

export type Spacing = keyof typeof spacing;
