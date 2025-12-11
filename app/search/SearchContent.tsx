'use client';

import { useSearchParams } from 'next/navigation';
import { useEverything } from '@/lib/hooks/useNews';
import { NewsList } from '@/components/news-list/NewsList';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ArticleSkeleton } from '@/components/ui/ArticleSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [visibleCount, setVisibleCount] = useState(10);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useEverything(query, 20);
  const articles = useMemo(() => data?.articles || [], [data?.articles]);

  // Reset visible count when query changes (using key pattern instead of effect)
  const prevQueryRef = useRef(query);
  if (prevQueryRef.current !== query) {
    prevQueryRef.current = query;
    setVisibleCount(10);
  }

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < articles.length) {
        setVisibleCount((prev) => Math.min(prev + 5, articles.length));
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

  const visibleArticles = useMemo(() => articles.slice(0, visibleCount), [articles, visibleCount]);

  if (!query) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-medium text-primary mb-4">Search News</h1>
          <p className="text-gray-600">Enter a search query to find news articles.</p>
        </div>
      </section>
    );
  }

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load search results. Please try again.'
    : null;

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-4xl font-medium text-primary mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {isLoading ? (
        <ArticleSkeleton count={6} />
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : (
        <NewsList
          title={`Search: ${query}`}
          articles={visibleArticles}
          loading={isLoading}
          error={null}
          category="general"
          lastArticleRef={lastArticleRef}
          hasMore={visibleCount < articles.length}
        />
      )}
    </section>
  );
}

