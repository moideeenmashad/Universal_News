import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { newsService } from '../api/news';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/src/types/news';
import { QUERY_STALE_TIME } from '@/src/constants/config';
import { ApiError } from '../errors/ApiError';

/**
 * Hook to fetch top headlines
 * @param category - News category (optional)
 * @param country - Country code (default: 'us')
 * @param pageSize - Number of articles (default: 20)
 */
export const useTopHeadlines = (
  category?: string,
  country: string = 'us',
  pageSize: number = 20
): UseQueryResult<NewsApiResponse, ApiError> => {
  return useQuery<NewsApiResponse, ApiError>({
    queryKey: ['topHeadlines', category, country, pageSize],
    queryFn: () => newsService.getTopHeadlines(category, country, pageSize),
    staleTime: QUERY_STALE_TIME,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) or 400 (bad request)
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 400)) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch articles by query
 * @param query - Search query
 * @param pageSize - Number of articles (default: 20)
 */
export const useEverything = (
  query: string,
  pageSize: number = 20
): UseQueryResult<NewsApiResponse, ApiError> => {
  return useQuery<NewsApiResponse, ApiError>({
    queryKey: ['everything', query, pageSize],
    queryFn: () => newsService.getEverything(query, pageSize),
    staleTime: QUERY_STALE_TIME,
    enabled: !!query && query.trim().length > 0,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 400)) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch latest news from NewsData.io
 * @param query - Search query (default: 'worldnews')
 */
export const useLatestNews = (
  query: string = 'worldnews'
): UseQueryResult<NewsDataResponse, ApiError> => {
  return useQuery<NewsDataResponse, ApiError>({
    queryKey: ['latestNews', query],
    queryFn: () => newsService.getLatestNews(query),
    staleTime: QUERY_STALE_TIME,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 400)) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch article by title slug
 * @param category - News category
 * @param title - Slugified article title
 */
export const useArticleByTitle = (
  category: string,
  title: string
): UseQueryResult<NewsArticle | null, ApiError> => {
  return useQuery<NewsArticle | null, ApiError>({
    queryKey: ['article', category, title],
    queryFn: () => newsService.getArticleByTitle(category, title),
    enabled: !!category && !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes for article details
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 400)) {
        return false;
      }
      return failureCount < 1;
    },
  });
};
