'use client';

import { useState, useEffect } from 'react';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';
import type { UseDataResult } from '@/types/hooks';
import { ApiError } from '../errors/ApiError';
import {
  getTopHeadlines as getTopHeadlinesAction,
  getEverything as getEverythingAction,
  getLatestNews as getLatestNewsAction,
  getArticleByTitle as getArticleByTitleAction,
  getArticleByTitleUniversal as getArticleByTitleUniversalAction,
} from '../actions/news';

/**
 * Shared data-fetching hook. `deps` drives when to re-fetch; `fetcher` always
 * captures the latest values via its closure.
 */
function useFetch<TResult>(
  fetcher: () => Promise<TResult>,
  deps: unknown[],
  enabled = true
): UseDataResult<TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function run() {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          setError(err instanceof ApiError ? err : new ApiError('Failed to fetch', 500));
          setIsLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, isLoading, error };
}

export const useTopHeadlines = (
  category?: string,
  country = 'us',
  pageSize = 20,
  enabled = true
): UseDataResult<NewsApiResponse> =>
  useFetch(() => getTopHeadlinesAction(category, country, pageSize), [category, country, pageSize], enabled);

export const useEverything = (
  query: string,
  pageSize = 20,
  domains?: string,
  enabled = true
): UseDataResult<NewsApiResponse> =>
  useFetch(
    () => getEverythingAction(query, pageSize, domains),
    [query, pageSize, domains],
    enabled && query.trim().length > 0
  );

export const useLatestNews = (
  query = 'worldnews',
  enabled = true
): UseDataResult<NewsDataResponse> =>
  useFetch(() => getLatestNewsAction(query), [query], enabled);

export const useArticleByTitle = (
  category: string,
  title: string
): UseDataResult<NewsArticle | null> =>
  useFetch(
    () => getArticleByTitleAction(category, title),
    [category, title],
    !!(category && title)
  );

export const useArticleByTitleUniversal = (
  title: string,
  searchQuery?: string
): UseDataResult<NewsArticle | null> =>
  useFetch(
    () => getArticleByTitleUniversalAction(title, searchQuery),
    [title, searchQuery],
    !!title
  );
