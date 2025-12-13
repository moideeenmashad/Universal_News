import type { NewsArticle, NewsDataArticle } from '@/types/news';

/**
 * Validates if an article has required fields
 */
export const isValidArticle = (article: unknown): article is NewsArticle => {
  if (!article || typeof article !== 'object') return false;
  const a = article as Partial<NewsArticle>;
  return !!(a.title && a.url && a.publishedAt);
};

/**
 * Validates if a NewsDataArticle has required fields
 */
export const isValidNewsDataArticle = (article: unknown): article is NewsDataArticle => {
  if (!article || typeof article !== 'object') return false;
  const a = article as Partial<NewsDataArticle>;
  return !!(a.title && a.pubDate);
};

/**
 * Sanitizes article title for safe display
 */
export const sanitizeTitle = (title: string): string => {
  return title.trim().replace(/\s+/g, ' ');
};

/**
 * Validates category string
 */
export const isValidCategory = (category: string): boolean => {
  const validCategories = [
    'world-news',
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];
  return validCategories.includes(category);
};

/**
 * Removes duplicate articles based on article_id, title, or URL
 */
export const removeDuplicateArticles = <T extends { article_id?: string; title: string; url?: string; link?: string }>(
  articles: T[]
): T[] => {
  const seen = new Set<string>();
  return articles.filter((article) => {
    // Use article_id if available (NewsData.io) - most reliable
    if (article.article_id) {
      if (seen.has(article.article_id)) {
        return false;
      }
      seen.add(article.article_id);
      return true;
    }
    
    // Fallback to title + URL combination for NewsAPI articles
    const url = (article.url || article.link || '').toLowerCase().trim();
    const title = article.title.toLowerCase().trim();
    const key = url ? `${title}_${url}` : title;
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

