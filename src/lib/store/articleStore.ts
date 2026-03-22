import { create } from 'zustand';
import type { ArticleStore, ArticleCacheEntry, UnifiedContent } from '@/types/store';

export type { UnifiedContent };

// Cache expiry: 1 hour
const CACHE_EXPIRY = 60 * 60 * 1000;

// Generate cache key from article title
const getCacheKey = (
  title: string,
  category?: string,
  type?: 'news' | 'podcast'
): string => {
  const normalizedTitle = title.toLowerCase().trim();
  const typePrefix = type || 'news';
  const categoryPrefix = category ? `${category}-` : '';
  return `${typePrefix}-${categoryPrefix}${normalizedTitle}`;
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  cache: new Map(),

  getCachedArticle: (title, category, type) => {
    const key = getCacheKey(title, category, type);
    const entry = get().cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    const now = Date.now();
    if (now - entry.timestamp > CACHE_EXPIRY) {
      get().cache.delete(key);
      set({ cache: new Map(get().cache) }); // Trigger re-render
      return null;
    }

    return entry.data;
  },

  setCachedArticle: (title, data, category, type) => {
    const key = getCacheKey(title, category, type);
    const newCache = new Map(get().cache);
    const entry: ArticleCacheEntry = { data, timestamp: Date.now() };
    newCache.set(key, entry);
    set({ cache: newCache });
  },

  clearExpiredCache: () => {
    const now = Date.now();
    const newCache = new Map(get().cache);
    let hasChanges = false;

    for (const [key, entry] of newCache.entries()) {
      if (now - entry.timestamp > CACHE_EXPIRY) {
        newCache.delete(key);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      set({ cache: newCache });
    }
  },

  clearAllCache: () => {
    set({ cache: new Map() });
  },
}));
