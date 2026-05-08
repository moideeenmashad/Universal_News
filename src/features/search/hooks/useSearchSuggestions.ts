'use client';

import { useQuery } from '@tanstack/react-query';
import { getSearchSuggestions } from '@/features/news/actions/news';
import { useDebounce } from '@/shared/hooks';
import type { UseSearchSuggestionsResult } from '@/shared/types';

/**
 * Hook for debounced search suggestions using TanStack Query
 */
export const useSearchSuggestions = (query: string): UseSearchSuggestionsResult => {
  const debouncedQuery = useDebounce(query, 1200);

  const { data: suggestions = [], isLoading, isFetching } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => getSearchSuggestions(debouncedQuery, 5),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return { 
    suggestions, 
    isLoading: isLoading || (query.trim().length >= 2 && query !== debouncedQuery),
    isDebouncing: query.trim().length >= 2 && query !== debouncedQuery
  };
};
