'use client';

import { useState, useEffect } from 'react';
import { getSearchSuggestionsGraphQL } from '../actions/graphqlNews';
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

    const debouncedSearch = debounce(async (searchQuery: string) => {
      setIsDebouncing(false);
      setIsLoading(true);

      try {
        // Using GraphQL for minimal data transfer (only needed fields)
        const results = await getSearchSuggestionsGraphQL(searchQuery, 5);
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
