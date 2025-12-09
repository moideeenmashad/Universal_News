'use server';

/**
 * Server Actions for GraphQL News Service
 * These actions use the GraphQL-style API with field selection
 */

import { graphqlNewsService } from '@/lib/api/graphqlNews';
import type { NewsArticle } from '@/types/news';
import { cache } from 'react';

/**
 * Get top headlines with GraphQL field selection
 * Cached for better performance
 */
export const getTopHeadlinesGraphQL = cache(
  async (category?: string, country: string = 'us', pageSize: number = 20): Promise<NewsArticle[]> => {
    return await graphqlNewsService.getTopHeadlines(category, {
      country,
      pageSize,
      revalidate: 60,
    });
  }
);

/**
 * Search articles with GraphQL field selection
 */
export const searchArticlesGraphQL = cache(
  async (query: string, pageSize: number = 20): Promise<NewsArticle[]> => {
    return await graphqlNewsService.searchArticles(query, {
      pageSize,
      revalidate: 60,
    });
  }
);

/**
 * Get search suggestions (minimal data)
 */
export const getSearchSuggestionsGraphQL = async (
  query: string,
  limit: number = 5
): Promise<NewsArticle[]> => {
  return await graphqlNewsService.getSearchSuggestions(query, limit);
};

/**
 * Get article by title in a specific category
 */
export const getArticleByTitleGraphQL = cache(
  async (category: string, title: string): Promise<NewsArticle | null> => {
    return await graphqlNewsService.getArticleByTitle(category, title);
  }
);

/**
 * Get article by title (universal search)
 */
export const getArticleByTitleUniversalGraphQL = cache(
  async (title: string, searchQuery?: string): Promise<NewsArticle | null> => {
    return await graphqlNewsService.getArticleByTitleUniversal(title, searchQuery);
  }
);

/**
 * Get latest news with optimized fields
 */
export const getLatestNewsGraphQL = cache(
  async (pageSize: number = 20): Promise<NewsArticle[]> => {
    return await graphqlNewsService.getLatestNews(pageSize);
  }
);
