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
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch headlines. Please check your API keys in Vercel environment variables.', 500);
  }
}

/**
 * Server action to fetch articles by query
 */
export async function getEverything(query: string, pageSize: number = 20): Promise<NewsApiResponse> {
  try {
    return await newsService.getEverything(query, pageSize);
  } catch (error) {
    console.error('Error in getEverything:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch articles. Please check your API keys in Vercel environment variables.', 500);
  }
}

/**
 * Server action to fetch latest news
 */
export async function getLatestNews(query: string = 'worldnews'): Promise<NewsDataResponse> {
  try {
    return await newsService.getLatestNews(query);
  } catch (error) {
    console.error('Error in getLatestNews:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch latest news. Please check your API keys in Vercel environment variables.', 500);
  }
}

/**
 * Server action to fetch article by title
 */
export async function getArticleByTitle(
  category: string,
  title: string
): Promise<NewsArticle | null> {
  return newsService.getArticleByTitle(category, title);
}

/**
 * Server action to fetch article by title (universal search)
 */
export async function getArticleByTitleUniversal(
  title: string,
  searchQuery?: string
): Promise<NewsArticle | null> {
  return newsService.getArticleByTitleUniversal(title, searchQuery);
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

