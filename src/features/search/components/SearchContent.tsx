'use client';

import { useSearchParams } from 'next/navigation';
import { useEverything } from '@/features/news/hooks/useNews'
import { useInfiniteScroll } from '@/shared/hooks'
import { useDebounce } from '@/shared/hooks';
import { NewsList } from '@/features/news/components';
import { useMemo } from 'react';
import { ErrorMessage } from '@/shared/components';
import { removeDuplicateArticles } from '@/shared/utils';

const DEBOUNCE_MS = 1200;

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  // Fetch more articles for comprehensive search results (100 is max for NewsAPI)
  const { data, isLoading, error } = useEverything(debouncedQuery, 100);

  const articles = useMemo(() => {
    const allArticles = data?.articles || [];
    return removeDuplicateArticles(allArticles);
  }, [data?.articles]);

  const { visibleCount, lastItemRef, hasMore } = useInfiniteScroll({
    totalCount: articles.length,
    resetKey: debouncedQuery,
  });

  const visibleArticles = useMemo(() => articles.slice(0, visibleCount), [articles, visibleCount]);

  const isDebouncing = query !== debouncedQuery;

  if (!query) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary mb-4">Search News</h1>
          <p className="text-sm sm:text-base text-gray-600">Enter a search query to find news articles.</p>
        </div>
      </section>
    );
  }

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load search results. Please try again.'
    : null;

  const totalResults = data?.totalResults || 0;
  const showingCount = Math.min(visibleCount, articles.length);

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary mb-2 leading-tight">
          Search Results for &quot;{query}&quot;
        </h1>
        {!isLoading && totalResults > 0 && (
          <p className="text-sm sm:text-base text-gray-600">
            Showing {showingCount} of {totalResults} {totalResults === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>
      {isLoading || isDebouncing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="rounded-md overflow-hidden bg-white" aria-hidden="true" role="presentation">
              <div className="h-48 md:h-64 w-full skeleton-shimmer rounded-sm mb-3"></div>
              <div className="space-y-2 mb-3">
                <div className="h-5 skeleton-shimmer rounded w-full"></div>
                <div className="h-5 skeleton-shimmer rounded w-4/5"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 skeleton-shimmer rounded w-20"></div>
                <div className="h-3 skeleton-shimmer rounded w-1"></div>
                <div className="h-3 skeleton-shimmer rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : articles.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg mb-2">No articles found for &quot;{debouncedQuery}&quot;</p>
          <p className="text-sm text-gray-500">Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <>
          <NewsList
            title=""
            articles={visibleArticles}
            loading={isLoading || isDebouncing}
            error={null}
            category="general"
            lastArticleRef={lastItemRef}
            hasMore={hasMore}
          />
          {totalResults > 100 && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Showing first 100 results. NewsAPI free tier limits results to 100 articles per query.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
