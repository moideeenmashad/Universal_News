'use client';

import { useQuery } from '@tanstack/react-query';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/shared/types';
import type { UseDataResult } from '@/shared/types';
import {
  getTopHeadlines as getTopHeadlinesAction,
  getEverything as getEverythingAction,
  getLatestNews as getLatestNewsAction,
  getArticleByTitle as getArticleByTitleAction,
  getArticleByTitleUniversal as getArticleByTitleUniversalAction,
} from '../actions/news';

/**
 * Shared data-fetching hook using TanStack Query.
 */
function useFetch<TResult>(
  queryKey: unknown[],
  queryFn: () => Promise<TResult>,
  enabled = true
): UseDataResult<TResult> {
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });

  return { 
    data: data ?? null, 
    isLoading, 
    error: error instanceof Error ? error : null 
  };
}

export const useTopHeadlines = (
  category?: string,
  country = 'us',
  pageSize = 20,
  enabled = true
): UseDataResult<NewsApiResponse> =>
  useFetch(
    ['top-headlines', category, country, pageSize],
    () => getTopHeadlinesAction(category, country, pageSize),
    enabled
  );

export const useEverything = (
  query: string,
  pageSize = 20,
  domains?: string,
  enabled = true
): UseDataResult<NewsApiResponse> =>
  useFetch(
    ['everything', query, pageSize, domains],
    () => getEverythingAction(query, pageSize, domains),
    enabled && query.trim().length > 0
  );

export const useLatestNews = (
  query = 'worldnews',
  enabled = true
): UseDataResult<NewsDataResponse> =>
  useFetch(
    ['latest-news', query],
    () => getLatestNewsAction(query),
    enabled
  );

export const useArticleByTitle = (
  category: string,
  title: string
): UseDataResult<NewsArticle | null> =>
  useFetch(
    ['article', category, title],
    () => getArticleByTitleAction(category, title),
    !!(category && title)
  );

export const useArticleByTitleUniversal = (
  title: string,
  searchQuery?: string
): UseDataResult<NewsArticle | null> =>
  useFetch(
    ['article-universal', title, searchQuery],
    () => getArticleByTitleUniversalAction(title, searchQuery),
    !!title
  );
