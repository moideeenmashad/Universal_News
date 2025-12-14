'use server';

import { newsService } from '../api/news';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';

/**
 * Server action to fetch top headlines
 */
export async function getTopHeadlines(
  category?: string,
  country: string = 'us',
  pageSize: number = 20
): Promise<NewsApiResponse> {
  try {
    return await newsService.getTopHeadlines(category, country, pageSize);
  } catch (error) {
    console.error('Error in getTopHeadlines:', error);
    // Never throw errors - always return error response to prevent 500 errors
    return {
      status: 'error',
      totalResults: 0,
      articles: [],
      message: error instanceof Error ? error.message : 'Failed to fetch headlines',
    };
  }
}

/**
 * Server action to fetch articles by query
 */
export async function getEverything(
  query: string,
  pageSize: number = 20,
  domains?: string
): Promise<NewsApiResponse> {
  try {
    return await newsService.getEverything(query, pageSize, undefined, domains);
  } catch (error) {
    console.error('Error in getEverything:', error);
    // Never throw errors - always return error response to prevent 500 errors
    return {
      status: 'error',
      totalResults: 0,
      articles: [],
      message: error instanceof Error ? error.message : 'Failed to fetch articles',
    };
  }
}

/**
 * Server action to fetch latest news
 */
export async function getLatestNews(query: string = 'latest news'): Promise<NewsDataResponse> {
  try {
    return await newsService.getLatestNews(query);
  } catch (error) {
    console.error('Error in getLatestNews:', error);
    // Never throw errors - always return error response to prevent 500 errors
    return {
      status: 'error',
      totalResults: 0,
      results: [],
    };
  }
}

/**
 * Server action to fetch article by title
 */
export async function getArticleByTitle(
  category: string,
  title: string
): Promise<NewsArticle | null> {
  try {
    return await newsService.getArticleByTitle(category, title);
  } catch (error) {
    console.error('Error in getArticleByTitle:', error);
    return null;
  }
}

/**
 * Server action to fetch article by title (universal search)
 */
export async function getArticleByTitleUniversal(
  title: string,
  searchQuery?: string
): Promise<NewsArticle | null> {
  try {
    return await newsService.getArticleByTitleUniversal(title, searchQuery);
  } catch (error) {
    console.error('Error in getArticleByTitleUniversal:', error);
    return null;
  }
}

/**
 * Server action to fetch search suggestions
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<NewsArticle[]> {
  try {
    return await newsService.getSearchSuggestions(query, limit);
  } catch (error) {
    console.error('Error in getSearchSuggestions:', error);
    // Don't throw for suggestions, just return empty array
    return [];
  }
}

