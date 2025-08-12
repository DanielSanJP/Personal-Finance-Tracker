import type { User } from './types';

// Simple in-memory cache for user data
class DataCache {
  private userCache: User | null | undefined = undefined;
  private userCacheTimestamp = 0;
  private readonly USER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Cache the current user
  setUser(user: User | null): void {
    this.userCache = user;
    this.userCacheTimestamp = Date.now();
  }

  // Get cached user if still valid
  getUser(): User | null | undefined {
    if (this.userCache === undefined) return undefined;
    
    const now = Date.now();
    if (now - this.userCacheTimestamp > this.USER_CACHE_DURATION) {
      // Cache expired
      this.userCache = undefined;
      this.userCacheTimestamp = 0;
      return undefined;
    }
    
    return this.userCache;
  }

  // Clear user cache
  clearUser(): void {
    this.userCache = undefined;
    this.userCacheTimestamp = 0;
  }

  // Clear all caches
  clearAll(): void {
    this.clearUser();
  }
}

// Export singleton instance
export const dataCache = new DataCache();
