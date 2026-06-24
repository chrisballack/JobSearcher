export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://remotive.com/api",

  // Cache
  CACHE: {
    ENABLED: true,
    META_SUFFIX: "_meta",
    TTL: {
      STATIC: 24 * 60 * 60 * 1000, // 24h: categories, types
      DYNAMIC: 15 * 60 * 1000, // 15min: list of jobs
      DETAIL: 5 * 60 * 1000, // 5min: employment breakdown
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
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Timeouts
  TIMEOUTS: {
    API: 10000,
    CACHE_READ: 5000,
  },

  // Environment
  IS_DEV: __DEV__,
} as const;

export default Config;
