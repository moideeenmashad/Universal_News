'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle } from '@/lib/utils/validation';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LazyNewsItem } from './LazyNewsItem';

interface WorldNewsSectionProps {
  title: string;
  articleUrlName: (text: string) => string;
}

export const WorldNewsSection = ({ title, articleUrlName }: WorldNewsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useEverything('keyword');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Data will be fetched automatically by React Query
        }
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
        <ArticleSkeleton count={6} />
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
};
