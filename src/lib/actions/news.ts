'use server';

import { newsService } from '../api/news';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';

/**
 * Server action to fetch top headlines
 */
export async function getTopHeadlines(
  category?: string,
  country: string = 'us',
  pageSize: number = 20
): Promise<NewsApiResponse> {
  return newsService.getTopHeadlines(category, country, pageSize);
}

/**
 * Server action to fetch articles by query
 */
export async function getEverything(query: string, pageSize: number = 20): Promise<NewsApiResponse> {
  return newsService.getEverything(query, pageSize);
}

/**
 * Server action to fetch latest news
 */
export async function getLatestNews(query: string = 'worldnews'): Promise<NewsDataResponse> {
  return newsService.getLatestNews(query);
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
  return newsService.getSearchSuggestions(query, limit);
}

