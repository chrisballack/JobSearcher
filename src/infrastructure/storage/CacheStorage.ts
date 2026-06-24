import AsyncStorage from "@react-native-async-storage/async-storage";
import { Config } from "@/core/constants/Config";
import { CachedData, isCacheExpired } from "@/core/types/Cache";

export class CacheStorage {
  private static instance: CacheStorage;

  private constructor() {}

  static getInstance(): CacheStorage {
    if (!CacheStorage.instance) {
      CacheStorage.instance = new CacheStorage();
    }
    return CacheStorage.instance;
  }

  // ==========================================================================
  // Private helpers
  // ==========================================================================
  private getMetaKey(key: string): string {
    return `${key}${Config.CACHE.META_SUFFIX}`;
  }

  // ==========================================================================
  // Reading
  // ==========================================================================
  async get<T>(key: string): Promise<T | null> {
    if (!Config.CACHE.ENABLED) return null;

    try {
      const [cachedData, cachedMeta] = await Promise.all([
        AsyncStorage.getItem(key),
        AsyncStorage.getItem(this.getMetaKey(key)),
      ]);

      if (!cachedData || !cachedMeta) {
        await this.clear(key);
        return null;
      }

      const metadata = JSON.parse(cachedMeta) as CachedData<T>;

      if (isCacheExpired(metadata)) {
        await this.clear(key);
        return null;
      }

      return JSON.parse(cachedData) as T;
    } catch (error) {
      if (__DEV__) {
        console.warn(`[CacheStorage] Read error for key "${key}":`, error);
      }
      await this.clear(key);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    if (!Config.CACHE.ENABLED) return false;

    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return false;

      const meta = await AsyncStorage.getItem(this.getMetaKey(key));
      if (!meta) return false;

      const metadata = JSON.parse(meta) as CachedData<unknown>;
      return !isCacheExpired(metadata);
    } catch {
      return false;
    }
  }

  // ==========================================================================
  // Writing
  // ==========================================================================
  async set<T>(key: string, data: T, ttlMs: number): Promise<void> {
    if (!Config.CACHE.ENABLED) return;

    try {
      const metadata: CachedData<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: ttlMs === Infinity ? Infinity : Date.now() + ttlMs,
      };

      await Promise.all([
        AsyncStorage.setItem(key, JSON.stringify(data)),
        AsyncStorage.setItem(this.getMetaKey(key), JSON.stringify(metadata)),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.warn(`[CacheStorage] Write error for key "${key}":`, error);
      }
    }
  }

  // ==========================================================================
  // Disposal
  // ==========================================================================
  async clear(key: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(key),
        AsyncStorage.removeItem(this.getMetaKey(key)),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.warn(`[CacheStorage] Clear error for key "${key}":`, error);
      }
    }
  }

  async clearByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter((key: string) => key.startsWith(prefix));

      if (matchingKeys.length === 0) return;

      const dataKeys = matchingKeys.filter(
        (key: string) => !key.endsWith(Config.CACHE.META_SUFFIX),
      );

      const keysToRemove = [
        ...dataKeys,
        ...dataKeys.map((k: string) => this.getMetaKey(k)),
      ];

      await AsyncStorage.multiRemove(keysToRemove);

      if (__DEV__) {
        console.log(
          `[CacheStorage] Cleared ${dataKeys.length} keys with prefix "${prefix}"`,
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(
          `[CacheStorage] Clear by prefix error for "${prefix}":`,
          error,
        );
      }
    }
  }

  async invalidateAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
      }
      if (__DEV__) {
        console.log(
          `[CacheStorage] Invalidated all cache (${keys.length} keys)`,
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[CacheStorage] Invalidate all error:", error);
      }
    }
  }
}
