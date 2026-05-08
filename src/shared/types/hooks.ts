import type { RefObject } from 'react';
import type { NewsArticle } from './index';

export interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UseSearchSuggestionsResult {
  suggestions: NewsArticle[];
  isLoading: boolean;
  isDebouncing: boolean;
}

export interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export interface UseInfiniteScrollOptions {
  totalCount: number;
  initialCount?: number;
  loadMoreCount?: number;
  resetKey?: unknown;
}

export interface UseInfiniteScrollResult {
  visibleCount: number;
  lastItemRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
}
