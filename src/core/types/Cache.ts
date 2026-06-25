export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number | null;
}

export const createCachedData = <T>(data: T, ttlMs: number): CachedData<T> => {
  const now = Date.now();
  return {
    data,
    timestamp: now,
    expiresAt: ttlMs === Infinity ? null : now + ttlMs,
  };
};

export const isCacheExpired = (cached: CachedData<unknown>): boolean => {
  if (cached.expiresAt === null) return false;
  return Date.now() > cached.expiresAt;
};
