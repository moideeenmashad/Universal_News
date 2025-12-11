'use client';

import { useState, useEffect } from 'react';
import { getSearchSuggestions } from '../actions/news';
import { debounce } from '../utils/debounce';
import type { NewsArticle } from '@/types/news';

interface UseSearchSuggestionsResult {
  suggestions: NewsArticle[];
  isLoading: boolean;
  isDebouncing: boolean;
}

/**
 * Hook for debounced search suggestions using Next.js server actions
 */
export const useSearchSuggestions = (query: string): UseSearchSuggestionsResult => {
  const [suggestions, setSuggestions] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    const debouncedSearch = debounce(async (searchQuery: string): Promise<void> => {
      setIsDebouncing(false);
      setIsLoading(true);

      try {
        const results = await getSearchSuggestions(searchQuery, 5);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel?.();
    };
  }, [query]);

  return { suggestions, isLoading, isDebouncing };
};
