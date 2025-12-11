import { promises as fs } from 'fs';
import path from 'path';
import type { NewsApiResponse, NewsDataResponse } from '@/types/news';

// Use /tmp on Vercel (writable), or .cache locally
const CACHE_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'news-cache')
  : path.join(process.cwd(), '.cache', 'news');
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Get cache file path for a given key
 */
function getCacheFilePath(key: string): string {
  // Sanitize key to be filesystem-safe
  const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
  return path.join(CACHE_DIR, `${safeKey}.json`);
}

/**
 * Save data to cache
 */
export async function saveToCache<T>(key: string, data: T): Promise<void> {
  try {
    await ensureCacheDir();
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    const filePath = getCacheFilePath(key);
    await fs.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
  } catch (error) {
    // Silently fail - caching is optional and may not work in all environments
    // (e.g., read-only filesystems)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Cache save failed for ${key} (this is OK):`, error);
    }
  }
}

/**
 * Load data from cache
 */
export async function loadFromCache<T>(key: string): Promise<T | null> {
  try {
    const filePath = getCacheFilePath(key);
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

