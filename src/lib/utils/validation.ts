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

