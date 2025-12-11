'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle, sanitizeTitle } from '@/lib/utils/validation';
import { formatDate } from '@/lib/utils/date';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LazyNewsItem } from './LazyNewsItem';

interface LatestNewsProps {
  title: string;
  articleUrlName: (text: string) => string;
}

export const LatestNews = memo(({ title, articleUrlName }: LatestNewsProps) => {
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

  const feature = articles[0];
  const sideStack = articles.slice(1, 3);
  const bottomRow = articles.slice(3, 6);

  const buildArticleUrl = (title: string) => `/${'general'}/${articleUrlName(title)}`;

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
        <ArticleSkeleton count={8} />
      ) : error ? (
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load news.'}
        />
      ) : articles.length === 0 || !feature ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Top block: large feature on left, two stacked on right */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-stretch">
            {/* Feature (large) */}
            <div className="relative group overflow-hidden rounded-sm h-full min-h-[360px]">
              <a
                href={buildArticleUrl(feature.title)}
                className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Read article: ${feature.title}`}
              >
                <div className="relative h-full min-h-[360px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.urlToImage || 'https://via.placeholder.com/800'}
                    alt={feature.title || 'Latest news image'}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <div className="text-xs flex items-center gap-2 opacity-90">
                      <span>{sanitizeTitle(feature.source?.name || 'Business')}</span>
                      <span aria-hidden="true">—</span>
                      <span>{formatDate(feature.publishedAt, 'MMM d, yyyy')}</span>
                    </div>
                    <h3 className="mt-2 text-lg md:text-xl font-semibold leading-tight line-clamp-2">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </a>
            </div>

            {/* Right stacked cards */}
            <div className="grid grid-rows-2 gap-5 h-full">
              {sideStack.map((article, idx) => (
                <a
                  key={article.url || `side-${idx}`}
                  href={buildArticleUrl(article.title)}
                  className="flex items-start gap-4 rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 h-full"
                  aria-label={`Read article: ${article.title}`}
                >
                  <div className="relative w-32 h-full max-h-28 flex-shrink-0 overflow-hidden rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.urlToImage || 'https://via.placeholder.com/200'}
                      alt={article.title || 'News image'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[13px] text-gray-600 mb-1">
                      {sanitizeTitle(article.source?.name || 'World News')}
                      <span className="mx-2 text-gray-400" aria-hidden="true">
                        —
                      </span>
                      <span>{formatDate(article.publishedAt, 'MMM d, yyyy')}</span>
                    </p>
                    <h4 className="text-sm md:text-base font-semibold text-primary leading-snug line-clamp-3">
                      {article.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom row: three cards */}
          {bottomRow.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bottomRow.map((article, index) => (
                <LazyNewsItem
                  key={article.url || `bottom-${index}`}
                  article={article}
                  index={index}
                  articleUrlName={articleUrlName}
                  baseUrl="/general"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
});

LatestNews.displayName = 'LatestNews';
