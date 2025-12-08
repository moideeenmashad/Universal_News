'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../api/news';
import type { NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';
import { debounce } from '../utils/debounce';

const DEBOUNCE_DELAY = 1000; // 1 second delay
const MIN_QUERY_LENGTH = 2; // Minimum characters before searching

/**
 * Hook for search suggestions with debouncing
 * Waits 1 second after user stops typing before making API call
 */
export const useSearchSuggestions = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce the query input
  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setDebouncedQuery('');
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const debounced = debounce(() => {
      setDebouncedQuery(query.trim());
      setIsDebouncing(false);
    }, DEBOUNCE_DELAY);

    debounced();

    return () => {
      setIsDebouncing(false);
    };
  }, [query]);

  // Only fetch if debounced query is valid
  const shouldFetch = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data, isLoading, error } = useQuery<NewsArticle[], ApiError>({
    queryKey: ['searchSuggestions', debouncedQuery],
    queryFn: () => newsService.getSearchSuggestions(debouncedQuery, 5),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes - suggestions don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: false, // Don't retry suggestions
  });

  const suggestions = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Remove duplicates and limit to 5
    const unique = Array.from(
      new Map(data.map((item) => [item.title, item])).values()
    );
    return unique.slice(0, 5);
  }, [data]);

  return {
    suggestions,
    isLoading: isLoading || isDebouncing,
    error,
    isDebouncing,
  };
};

