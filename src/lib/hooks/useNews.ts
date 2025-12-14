'use client';

import { useState, useEffect, useRef } from 'react';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';
import {
  getTopHeadlines as getTopHeadlinesAction,
  getEverything as getEverythingAction,
  getLatestNews as getLatestNewsAction,
  getArticleByTitle as getArticleByTitleAction,
  getArticleByTitleUniversal as getArticleByTitleUniversalAction,
} from '../actions/news';

interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch top headlines using Next.js server actions
 * @param enabled - If false, the hook won't fetch data (useful for lazy loading)
 */
export const useTopHeadlines = (
  category?: string,
  country: string = 'us',
  pageSize: number = 20,
  enabled: boolean = true
): UseDataResult<NewsApiResponse> => {
  const [data, setData] = useState<NewsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getTopHeadlinesAction(category, country, pageSize);
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
  }, [category, country, pageSize, enabled]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch articles by query using Next.js server actions
 * @param enabled - If false, the hook won't fetch data (useful for lazy loading)
 */
export const useEverything = (
  query: string,
  pageSize: number = 20,
  domains?: string,
  enabled: boolean = true
): UseDataResult<NewsApiResponse> => {
  const [data, setData] = useState<NewsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(enabled && query.trim().length > 0);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.trim().length === 0) {
      // Use setTimeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setData(null);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getEverythingAction(query, pageSize, domains);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
          const apiError = err instanceof ApiError ? err : new ApiError('Failed to fetch articles', 500);
          setError(apiError);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [query, pageSize, domains, enabled]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch latest news using Next.js server actions
 * @param enabled - If false, the hook won't fetch data (useful for lazy loading)
 */
export const useLatestNews = (query: string = 'worldnews', enabled: boolean = true): UseDataResult<NewsDataResponse> => {
  const [data, setData] = useState<NewsDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getLatestNewsAction(query);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
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
  }, [query, enabled]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch article by title using Next.js server actions
 */
export const useArticleByTitle = (
  category: string,
  title: string
): UseDataResult<NewsArticle | null> => {
  const [data, setData] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!category || !title) {
      // Use setTimeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setData(null);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getArticleByTitleAction(category, title);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
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
 * Hook to fetch article by title (universal search) using Next.js server actions
 */
export const useArticleByTitleUniversal = (
  title: string,
  searchQuery?: string
): UseDataResult<NewsArticle | null> => {
  const [data, setData] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!title) {
      // Use setTimeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setData(null);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getArticleByTitleUniversalAction(title, searchQuery);
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === 'AbortError')) {
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
