'use client';

/**
 * React Hooks for GraphQL News Service
 * These hooks use the GraphQL-style API with field selection for better performance
 */

import { useState, useEffect, useRef } from 'react';
import type { NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';
import {
  getTopHeadlinesGraphQL,
  searchArticlesGraphQL,
  getSearchSuggestionsGraphQL,
  getArticleByTitleGraphQL,
  getArticleByTitleUniversalGraphQL,
  getLatestNewsGraphQL,
} from '../actions/graphqlNews';

interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch top headlines using GraphQL
 * Only fetches the fields needed for news cards
 */
export const useTopHeadlinesGraphQL = (
  category?: string,
  country: string = 'us',
  pageSize: number = 20
): UseDataResult<NewsArticle[]> => {
  const [data, setData] = useState<NewsArticle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getTopHeadlinesGraphQL(category, country, pageSize);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to fetch headlines', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, country, pageSize]);

  return { data, isLoading, error };
};

/**
 * Hook to search articles using GraphQL
 */
export const useSearchArticlesGraphQL = (
  query: string,
  pageSize: number = 20
): UseDataResult<NewsArticle[]> => {
  const [data, setData] = useState<NewsArticle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setData(null);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await searchArticlesGraphQL(query, pageSize);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to search articles', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [query, pageSize]);

  return { data, isLoading, error };
};

/**
 * Hook to get latest news using GraphQL
 */
export const useLatestNewsGraphQL = (
  pageSize: number = 20
): UseDataResult<NewsArticle[]> => {
  const [data, setData] = useState<NewsArticle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getLatestNewsGraphQL(pageSize);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to fetch latest news', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [pageSize]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch article by title using GraphQL
 */
export const useArticleByTitleGraphQL = (
  category: string,
  title: string
): UseDataResult<NewsArticle | null> => {
  const [data, setData] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category || !title) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getArticleByTitleGraphQL(category, title);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to fetch article', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, title]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch article by title (universal search) using GraphQL
 */
export const useArticleByTitleUniversalGraphQL = (
  title: string,
  searchQuery?: string
): UseDataResult<NewsArticle | null> => {
  const [data, setData] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!title) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getArticleByTitleUniversalGraphQL(title, searchQuery);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to fetch article', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [title, searchQuery]);

  return { data, isLoading, error };
};
