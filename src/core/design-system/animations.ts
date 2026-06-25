// ============================================================================
// Durations (in milliseconds)
// ============================================================================
export const animationDuration = {
  instant: 100,
  fast: 150,
  normal: 200,
  slow: 250,
  slower: 300,
  slowest: 400,
} as const;

// ============================================================================
// Spring configurations
// ============================================================================
export const springConfig = {
  gentle: {
    friction: 12,
    tension: 60,
  },
  normal: {
    friction: 10,
    tension: 80,
  },
  bouncy: {
    friction: 8,
    tension: 100,
  },
  stiff: {
    friction: 6,
    tension: 120,
  },
} as const;

// ============================================================================
// Animation values
// ============================================================================
export const animationValues = {
  opacity: {
    hidden: 0,
    visible: 1,
  },
  scale: {
    hidden: 0,
    visible: 1,
    pressed: 0.95,
  },
  translateY: {
    hidden: -100,
    visible: 0,
    slideDown: 100,
  },
} as const;

// ============================================================================
// Thresholds
// ============================================================================
export const thresholds = {
  minLength: {
    search: 1,
    validation: 3,
  },
} as const;

export type AnimationDuration = keyof typeof animationDuration;
export type SpringConfig = keyof typeof springConfig;
