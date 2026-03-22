'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { UseInfiniteScrollOptions, UseInfiniteScrollResult } from '@/types/hooks';

const DEFAULT_INITIAL_COUNT = 10;
const DEFAULT_LOAD_MORE_COUNT = 5;

export const useInfiniteScroll = ({
  totalCount,
  initialCount = DEFAULT_INITIAL_COUNT,
  loadMoreCount = DEFAULT_LOAD_MORE_COUNT,
  resetKey,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < totalCount) {
        setVisibleCount((prev) => Math.min(prev + loadMoreCount, totalCount));
      }
    },
    [visibleCount, totalCount, loadMoreCount]
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    if (lastItemRef.current) observer.current.observe(lastItemRef.current);

    return () => observer.current?.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [resetKey, initialCount]);

  return { visibleCount, lastItemRef, hasMore: visibleCount < totalCount };
};
