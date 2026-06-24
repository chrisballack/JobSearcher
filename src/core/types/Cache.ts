export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const createCachedData = <T>(data: T, ttlMs: number): CachedData<T> => {
  const now = Date.now();
  return {
    data,
    timestamp: now,
    expiresAt: ttlMs === Infinity ? Infinity : now + ttlMs,
  };
};

export const isCacheExpired = (cached: CachedData<unknown>): boolean => {
  if (cached.expiresAt === Infinity) return false;
  return Date.now() > cached.expiresAt;
};
