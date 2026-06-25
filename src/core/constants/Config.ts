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
// API
// ============================================================================
export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://remotive.com/api",

  // Cache
  CACHE: {
    ENABLED: true,
    META_SUFFIX: "_meta",
    TTL: {
      STATIC: TIME.DAY, // 24h: categories, types
      DYNAMIC: 15 * TIME.MINUTE, // 15 mins: list of jobs
      DETAIL: 5 * TIME.MINUTE, // 5 mins: employment details
      FOREVER: Infinity, // ∞: favourites (never expire)
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

  // Environment
  IS_DEV: __DEV__,
} as const;

export default Config;
