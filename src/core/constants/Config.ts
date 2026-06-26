// ============================================================================
// Time constants (in milliseconds)
// ============================================================================
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// Environment
// ============================================================================
export type Environment = "development" | "staging" | "production";

const ENV: Environment =
  (process.env.EXPO_PUBLIC_ENV as Environment) || "development";

// ============================================================================
// API
// ============================================================================
export const Config = {
  // Environment
  ENV,
  IS_DEV: __DEV__,

  // API
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://remotive.com/api",

  // Endpoints
  ENDPOINTS: {
    CATEGORIES: "/remote-jobs/categories",
    JOBS: "/remote-jobs",
  },

  // Cache
  CACHE: {
    ENABLED: true,
    META_SUFFIX: "_meta",
    TTL: {
      STATIC: TIME.DAY,
      DYNAMIC: 15 * TIME.MINUTE,
      DETAIL: 5 * TIME.MINUTE,
      FOREVER: Infinity,
    },
    PREFIXES: {
      CATEGORIES: "CATEGORIES_",
      JOB_TYPES: "JOB_TYPES_",
      JOBS_LIST: "JOBS_LIST_",
      JOB_DETAIL: "JOB_DETAIL_",
      FAVORITES: "FAVORITES_",
    },
  },

  // Pagination
  QUERY: {
    RETRY: 1,
    STALE_TIME: 5 * TIME.MINUTE,
    REFETCH_ON_WINDOW_FOCUS: false,
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Timeouts
  TIMEOUTS: {
    API: 10 * TIME.SECOND,
    CACHE_READ: 5 * TIME.SECOND,
  },
} as const;

export default Config;
