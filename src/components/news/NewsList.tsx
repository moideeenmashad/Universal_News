'use client';

import { useMemo } from 'react';
import { slugify } from '@/lib/utils/string';
import { isValidArticle } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LazyArticle } from './LazyArticle';

interface NewsListProps {
  title: string;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  lastArticleRef: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  category: string;
}

export const NewsList = ({
  title,
  articles,
  loading,
  error,
  lastArticleRef,
  hasMore,
  category,
}: NewsListProps) => {
  const isInitialLoad = articles.length === 0 && loading;
  const validArticles = articles.filter(isValidArticle);

  // Only render visible articles + buffer
  const visibleArticles = useMemo(() => {
    // Show all articles, but LazyArticle will handle visibility
    return validArticles;
  }, [validArticles]);

  return (
    <section className="mx-auto max-w-screen-xl mb-[100px] px-4 md:px-0" aria-label={title}>
      <div className="news-list-container mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between border-b border-primary pb-3 mb-10">
          <h2 className="text-2xl md:text-4xl font-medium text-primary uppercase">{title}</h2>
        </div>

        {error && <ErrorMessage message={error} className="mb-5" />}

        {isInitialLoad ? (
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
        ) : visibleArticles.length === 0 && !loading ? (
          <div className="text-center py-12" role="status">
            <p className="text-gray-600 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visibleArticles.map((article, index) => {
              const isLast = index === visibleArticles.length - 1;
              return (
                <div key={article.url || `article-${index}`} ref={isLast ? lastArticleRef : null}>
                  <LazyArticle
                    article={article}
                    index={index}
                    category={category}
                    onVisible={() => {
                      // Optional: Track visibility for analytics
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {articles.length > 0 && loading && hasMore && (
          <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
              {Array(3).fill(0).map((_, i) => (
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
          </div>
        )}
      </div>
    </section>
  );
};
