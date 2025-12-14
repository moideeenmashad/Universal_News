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
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit length for comparison
};

/**
 * Normalizes URL for comparison (removes query params, fragments, trailing slashes)
 */
const normalizeUrl = (url: string): string => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    // Remove query params and fragments for comparison
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`.toLowerCase().replace(/\/$/, '');
  } catch {
    // If URL parsing fails, just normalize the string
    return url.toLowerCase().split('?')[0].split('#')[0].replace(/\/$/, '');
  }
};

/**
 * Removes duplicate articles based on article_id, title, or URL
 * Uses multiple strategies to catch duplicates more effectively
 */
export const removeDuplicateArticles = <T extends { article_id?: string; title: string; url?: string; link?: string }>(
  articles: T[]
): T[] => {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const seenTitleUrlCombos = new Set<string>();
  
  return articles.filter((article) => {
    // Strategy 1: Use article_id if available (NewsData.io) - most reliable
    if (article.article_id) {
      if (seenIds.has(article.article_id)) {
        return false;
      }
      seenIds.add(article.article_id);
      return true;
    }
    
    // Strategy 2: Normalize and check title
    const normalizedTitle = normalizeString(article.title);
    if (!normalizedTitle) return false; // Skip articles without valid titles
    
    // Strategy 3: Normalize and check URL
    const rawUrl = article.url || article.link || '';
    const normalizedUrl = rawUrl ? normalizeUrl(rawUrl) : '';
    
    // Strategy 4: Check title-only duplicates (same title = likely duplicate)
    if (normalizedTitle && seenTitles.has(normalizedTitle)) {
      // If we have a URL, check if it's the same URL too
      if (normalizedUrl && seenUrls.has(normalizedUrl)) {
        return false; // Same title AND same URL = definitely duplicate
      }
      // Same title but different URL - might be different sources, but likely duplicate content
      // Only filter if title is substantial (more than 20 chars) to avoid false positives
      if (normalizedTitle.length > 20) {
        return false;
      }
    }
    
    // Strategy 5: Check URL-only duplicates (same URL = definitely duplicate)
    if (normalizedUrl && seenUrls.has(normalizedUrl)) {
      return false;
    }
    
    // Strategy 6: Check title+URL combination
    const titleUrlKey = normalizedUrl 
      ? `${normalizedTitle}_${normalizedUrl}` 
      : normalizedTitle;
    
    if (seenTitleUrlCombos.has(titleUrlKey)) {
      return false;
    }
    
    // Add to all tracking sets
    if (normalizedTitle) seenTitles.add(normalizedTitle);
    if (normalizedUrl) seenUrls.add(normalizedUrl);
    seenTitleUrlCombos.add(titleUrlKey);
    
    return true;
  });
};

