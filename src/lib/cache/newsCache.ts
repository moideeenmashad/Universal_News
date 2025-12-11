import type { NewsApiResponse, NewsDataResponse } from '@/types/news';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cache directory path (server-only)
 */
function getCacheDir(): string {
  if (typeof window !== 'undefined') {
    return ''; // Client-side - no cache directory
  }
  
  // Server-side only
  if (process.env.VERCEL) {
    return '/tmp/news-cache';
  }
  return '.cache/news';
}

/**
 * Get cache file path for a given key (server-only)
 */
function getCacheFilePath(key: string): string | null {
  if (typeof window !== 'undefined') return null; // Client-side - no file path
  
  // Use dynamic require that webpack won't try to resolve
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const cacheDir = getCacheDir();
    // Sanitize key to be filesystem-safe
    const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
    return path.join(cacheDir, `${safeKey}.json`);
  } catch {
    return null;
  }
}

/**
 * Save data to cache (server-only, fails silently on client)
 */
export async function saveToCache<T>(key: string, data: T): Promise<void> {
  if (typeof window !== 'undefined') return; // Client-side - skip caching
  
  try {
    // Use dynamic require that webpack won't try to resolve
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs').promises;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    
    const cacheDir = getCacheDir();
    await fs.mkdir(cacheDir, { recursive: true });
    
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    
    const filePath = getCacheFilePath(key);
    if (!filePath) return;
    
    await fs.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
  } catch (error) {
    // Silently fail - caching is optional and may not work in all environments
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Cache save failed for ${key} (this is OK):`, error);
    }
  }
}

/**
 * Load data from cache (server-only, returns null on client)
 */
export async function loadFromCache<T>(key: string): Promise<T | null> {
  if (typeof window !== 'undefined') return null; // Client-side - no cache access
  
  try {
    // Use dynamic require that webpack won't try to resolve
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs').promises;
    
    const filePath = getCacheFilePath(key);
    if (!filePath) return null;
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cacheEntry: CacheEntry<T> = JSON.parse(fileContent);

    // Check if cache is still valid
    const age = Date.now() - cacheEntry.timestamp;
    if (age > CACHE_DURATION) {
      // Cache expired
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    // Cache file doesn't exist or is invalid
    return null;
  }
}

/**
 * Generate cache key for headlines request
 */
export function getHeadlinesCacheKey(category?: string, country?: string, pageSize?: number): string {
  return `headlines_${category || 'all'}_${country || 'us'}_${pageSize || 20}`;
}

/**
 * Generate cache key for everything/search request
 */
export function getEverythingCacheKey(query: string, pageSize?: number): string {
  return `everything_${query}_${pageSize || 20}`;
}

/**
 * Generate cache key for latest news request
 */
export function getLatestNewsCacheKey(query?: string): string {
  return `latest_${query || 'worldnews'}`;
}
