import { create } from 'zustand';

type UnifiedContent = {
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  sourceName?: string;
  publishedAt: string;
  url?: string;
  link?: string;
  type: 'news' | 'podcast';
};

type CacheEntry = {
  data: UnifiedContent;
  timestamp: number;
};

interface ArticleStore {
  cache: Map<string, CacheEntry>;
  // Get article from cache
  getCachedArticle: (
    title: string,
    category?: string,
    type?: 'news' | 'podcast'
  ) => UnifiedContent | null;
  // Store article in cache
  setCachedArticle: (
    title: string,
    data: UnifiedContent,
    category?: string,
    type?: 'news' | 'podcast'
  ) => void;
  // Clear expired cache entries
  clearExpiredCache: () => void;
  // Clear all cache
  clearAllCache: () => void;
}

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
    newCache.set(key, {
      data,
      timestamp: Date.now(),
    });
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

