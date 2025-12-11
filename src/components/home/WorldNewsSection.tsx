'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle, sanitizeTitle } from '@/lib/utils/validation';
import { formatDate } from '@/lib/utils/date';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
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

  const feature = articles[0];
  const sideStack = articles.slice(1, 4);

  const buildArticleUrl = (title: string) => `/world-news/${articleUrlName(title)}`;

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
      ) : articles.length === 0 || !feature ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-stretch">
            {/* Feature large card */}
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
                    alt={feature.title || 'World news image'}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <div>
                      <span className="inline-block bg-white/90 text-gray-900 text-[11px] font-semibold px-3 py-1 rounded-sm mb-3">
                        {formatDate(feature.publishedAt, 'MMM d, yyyy')}
                      </span>
                      <h3 className="text-xl md:text-2xl font-semibold leading-tight line-clamp-3">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs opacity-90">
                      By {sanitizeTitle(feature.author || 'Staff Writer')}
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* Right stacked cards */}
            <div className="grid grid-rows-3 gap-5 h-full">
              {sideStack.map((article, idx) => (
                <a
                  key={article.url || `world-side-${idx}`}
                  href={buildArticleUrl(article.title)}
                  className="flex items-start gap-4 rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 h-full"
                  aria-label={`Read article: ${article.title}`}
                >
                  <div className="relative w-28 h-full max-h-28 flex-shrink-0 overflow-hidden rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.urlToImage || 'https://via.placeholder.com/200'}
                      alt={article.title || 'News image'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[12px] text-gray-600 mb-1">
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
        </div>
      )}
    </section>
  );
});

WorldNewsSection.displayName = 'WorldNewsSection';
