/**
 * Stale-While-Revalidate API Cache Utility
 * Provides in-memory + sessionStorage caching with configurable TTL (default 5 minutes).
 */

const memoryCache = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const apiCache = {
  /**
   * Get cached data if valid, otherwise execute fetcher function and cache result.
   */
  getOrFetch: async (key, fetcher, ttl = DEFAULT_TTL_MS) => {
    const now = Date.now();

    // 1. Check in-memory cache
    if (memoryCache.has(key)) {
      const entry = memoryCache.get(key);
      if (now - entry.timestamp < ttl) {
        return entry.data;
      }
    }

    // 2. Check sessionStorage fallback
    try {
      const storageKey = `sds_cache_${key}`;
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (now - parsed.timestamp < ttl) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    // 3. Fetch fresh data
    const freshData = await fetcher();
    
    if (freshData !== null && freshData !== undefined) {
      const cacheEntry = { data: freshData, timestamp: now };
      memoryCache.set(key, cacheEntry);
      try {
        sessionStorage.setItem(`sds_cache_${key}`, JSON.stringify(cacheEntry));
      } catch (e) {
        // Storage full or restricted
      }
    }

    return freshData;
  },

  /**
   * Manually invalidate a specific key or all keys
   */
  invalidate: (key) => {
    if (key) {
      memoryCache.delete(key);
      try {
        sessionStorage.removeItem(`sds_cache_${key}`);
      } catch (e) {}
    } else {
      memoryCache.clear();
      try {
        Object.keys(sessionStorage).forEach(k => {
          if (k.startsWith('sds_cache_')) {
            sessionStorage.removeItem(k);
          }
        });
      } catch (e) {}
    }
  }
};

export default apiCache;
