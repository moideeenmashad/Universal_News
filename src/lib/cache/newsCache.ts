import type { NewsApiResponse, NewsDataResponse } from '@/types/news';

// Only import fs on server-side
let fs: typeof import('fs').promises | null = null;
let path: typeof import('path') | null = null;

// Lazy load Node.js modules only on server
async function getNodeModules() {
  if (typeof window !== 'undefined') {
    // Client-side - return null
    return { fs: null, path: null };
  }
  
  if (!fs || !path) {
    // Lazy load on server
    fs = (await import('fs')).promises;
    path = await import('path');
  }
  
  return { fs, path };
}

// Use /tmp on Vercel (writable), or .cache locally
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

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Ensure cache directory exists (server-only)
 */
async function ensureCacheDir(): Promise<void> {
  if (typeof window !== 'undefined') return; // Client-side - skip
  
  try {
    const { fs: fsModule, path: pathModule } = await getNodeModules();
    if (!fsModule || !pathModule) return;
    
    const cacheDir = getCacheDir();
    await fsModule.mkdir(cacheDir, { recursive: true });
  } catch (error) {
    // Directory might already exist or not writable
  }
}

/**
 * Get cache file path for a given key (server-only)
 */
async function getCacheFilePath(key: string): Promise<string | null> {
  if (typeof window !== 'undefined') return null; // Client-side - no file path
  
  const { path: pathModule } = await getNodeModules();
  if (!pathModule) return null;
  
  const cacheDir = getCacheDir();
  // Sanitize key to be filesystem-safe
  const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
  return pathModule.join(cacheDir, `${safeKey}.json`);
}

/**
 * Save data to cache (server-only, fails silently on client)
 */
export async function saveToCache<T>(key: string, data: T): Promise<void> {
  if (typeof window !== 'undefined') return; // Client-side - skip caching
  
  try {
    await ensureCacheDir();
    const { fs: fsModule, path: pathModule } = await getNodeModules();
    if (!fsModule || !pathModule) return;
    
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    const filePath = await getCacheFilePath(key);
    if (!filePath) return;
    
    await fsModule.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
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
    const { fs: fsModule } = await getNodeModules();
    if (!fsModule) return null;
    
    const filePath = await getCacheFilePath(key);
    if (!filePath) return null;
    
    const fileContent = await fsModule.readFile(filePath, 'utf-8');
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
