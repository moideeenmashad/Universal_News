'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle } from '@/lib/utils/validation';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LazyNewsItem } from './LazyNewsItem';

interface WorldNewsSectionProps {
  title: string;
  articleUrlName: (text: string) => string;
}

export const WorldNewsSection = memo(({ title, articleUrlName }: WorldNewsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useEverything('keyword');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      () => {
        // Data will be fetched automatically
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const articles = useMemo(() => {
    const allArticles = data?.articles?.slice(1, 8) || [];
    return allArticles.filter(isValidArticle);
  }, [data?.articles]);

  return (
    <section
      className="mx-auto max-w-screen-xl mb-[100px] px-4 md:px-0"
      ref={containerRef}
      aria-label={title}
    >
      <div className="flex items-center justify-between border-b border-primary pb-3 mb-10">
        <h2 className="text-2xl md:text-4xl font-medium text-primary uppercase">{title}</h2>
      </div>

      {isLoading ? (
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
      ) : error ? (
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load news.'}
        />
      ) : articles.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {articles.map((article, index) => (
            <LazyNewsItem
              key={article.url || `article-${index}`}
              article={article}
              index={index}
              articleUrlName={articleUrlName}
              baseUrl="/world-news"
            />
          ))}
        </div>
      )}
    </section>
  );
});

WorldNewsSection.displayName = 'WorldNewsSection';
