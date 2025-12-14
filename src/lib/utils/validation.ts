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
 * Normalizes a string for duplicate comparison (removes special chars, extra spaces)
 */
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
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
    
    // Fallback to normalized title + URL combination for NewsAPI articles
    const url = (article.url || article.link || '').toLowerCase().trim();
    const normalizedTitle = normalizeString(article.title);
    
    // Create keys for both title-only and title+URL to catch more duplicates
    const titleKey = normalizedTitle;
    const urlKey = url ? `${normalizedTitle}_${url}` : normalizedTitle;
    
    // Check if we've seen this article by title or title+URL
    if (seen.has(titleKey) || (url && seen.has(urlKey))) {
      return false;
    }
    
    // Add both keys to catch future duplicates
    seen.add(titleKey);
    if (url) {
      seen.add(urlKey);
    }
    return true;
  });
};

