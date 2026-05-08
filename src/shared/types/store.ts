export type UnifiedContent = {
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

export type ArticleCacheEntry = {
  data: UnifiedContent;
  timestamp: number;
};

export interface ArticleStore {
  cache: Map<string, ArticleCacheEntry>;
  getCachedArticle: (title: string, category?: string, type?: 'news' | 'podcast') => UnifiedContent | null;
  setCachedArticle: (title: string, data: UnifiedContent, category?: string, type?: 'news' | 'podcast') => void;
  clearExpiredCache: () => void;
  clearAllCache: () => void;
}
