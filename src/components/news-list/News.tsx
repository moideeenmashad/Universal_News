'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { NewsList } from './NewsList';
import { useTopHeadlines } from '@/lib/hooks/useNews';
import { isValidCategory } from '@/lib/utils/validation';

interface NewsProps {
  category: string;
  title: string;
}

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_COUNT = 5;

export const News = ({ category, title }: NewsProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useRef<HTMLDivElement | null>(null);

  // Validate category
  const actualCategory = useMemo(() => {
    if (category === 'world-news') return undefined;
    return isValidCategory(category) ? category : undefined;
  }, [category]);

  const { data, isLoading, error } = useTopHeadlines(actualCategory, 'us', 20);
  const articles = useMemo(() => data?.articles || [], [data?.articles]);

  // Handle intersection observer for infinite scroll
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < articles.length) {
        setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, articles.length));
      }
    },
    [visibleCount, articles.length]
  );

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    if (lastArticleRef.current) {
      observer.current.observe(lastArticleRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersection]);

  // Reset visible count when category changes
  const prevCategoryRef = useRef(category);
  if (prevCategoryRef.current !== category) {
    prevCategoryRef.current = category;
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  const visibleArticles = useMemo(
    () => articles.slice(0, visibleCount),
    [articles, visibleCount]
  );

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load news. Please try again.'
    : null;

  return (
    <NewsList
      title={title}
      articles={visibleArticles}
      loading={isLoading}
      error={errorMessage}
      category={category}
      lastArticleRef={lastArticleRef}
      hasMore={visibleCount < articles.length}
    />
  );
};
