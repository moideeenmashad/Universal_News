import { slugify } from './string';
import { guessArticleCategory } from './articleCategory';
import type { NewsArticle } from '@/types/news';

/**
 * Generates a category-based article URL
 * @param article - The news article
 * @param category - Optional category (if not provided, will guess from article)
 * @returns URL path like '/technology/article-title' or '/general/article-title'
 */
export const getArticleUrl = (article: NewsArticle, category?: string): string => {
  const articleSlug = slugify(article.title);
  
  // Use provided category, or guess from article, or default to 'general'
  const articleCategory = category || guessArticleCategory(article) || 'general';
  
  return `/${articleCategory}/${articleSlug}`;
};

/**
 * Generates a category-based article URL from title and optional category
 * @param title - Article title
 * @param category - Optional category (defaults to 'general')
 * @returns URL path like '/technology/article-title' or '/general/article-title'
 */
export const getArticleUrlFromTitle = (title: string, category: string = 'general'): string => {
  const articleSlug = slugify(title);
  return `/${category}/${articleSlug}`;
};

