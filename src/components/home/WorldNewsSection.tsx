'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle, sanitizeTitle } from '@/lib/utils/validation';
import { formatDate } from '@/lib/utils/date';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ROUTES } from '@/constants/routes';

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
    const allArticles = data?.articles || [];
    return allArticles.filter(isValidArticle);
  }, [data?.articles]);

  // Main hero uses the second item when available, otherwise the first
  const feature = articles[1] || articles[0];
  const sideStack = articles.filter((a) => a !== feature).slice(0, 3);

  return (
    <div className="mx-auto max-w-screen-xl mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" href={ROUTES.WORLD_NEWS}>
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
            {/* Main hero skeleton */}
            <div className="md:row-span-3 md:col-span-2">
              <div className="overflow-hidden rounded-sm relative">
                <div className="w-full h-[520px] rounded-sm bg-gray-200 animate-pulse"></div>
                <div className="absolute top-4 left-4 right-4 p-4 rounded-sm md:w-1/2 bottom-4 grid bg-gray-300/70">
                  <div className="space-y-3">
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
            {/* Side list skeletons */}
            {[0, 1, 2].map((i) => (
              <div key={`skeleton-${i}`} className="grid items-center gap-4 [grid-template-columns:40%_60%]">
                <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-sm"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load news.'} />
      ) : articles.length === 0 || !feature ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
          {/* Main Grid Item with Image and Overlay */}
          <div className="md:row-span-3 md:col-span-2">
            <div className="overflow-hidden rounded-sm relative block">
              <div className="overflow-hidden rounded-sm relative">
                {feature?.urlToImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={feature.urlToImage}
                    alt={feature.title || 'news thumbnail'}
                    className="w-full h-[520px] object-cover hover:scale-105 ease-in-out transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[520px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                )}
                {/* Overlay Card */}
                <div className="absolute top-4 left-4 right-4 p-4 rounded-sm md:w-1/2 bottom-4 grid bg-primary">
                  <div>
                    <p className="text-xs px-5 py-2 bg-white text-primary w-fit rounded-lg mb-[12px]">
                      {feature?.publishedAt ? formatDate(feature.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}
                    </p>
                    <p className="text-primary text-[26px] font-semibold leading-snug">
                      {feature?.title || 'Untitled'}
                    </p>
                  </div>
                  <p className="text-sm text-primary">
                    <span>By.</span>
                    <span> {sanitizeTitle(feature?.author || 'Unknown Author')} / </span>
                    <span>Publisher</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column cards */}
          {sideStack.length > 0
            ? sideStack.slice(0, 3).map((article, index) => (
                <div
                  key={article.url || `world-${index}`}
                  className="grid items-center gap-4 [grid-template-columns:40%_60%]"
                >
                  <div className="image-container mr-[8px] overflow-hidden rounded-sm relative">
                    {article?.urlToImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-auto aspect-square object-cover object-center hover:scale-105 ease-in-out transition-transform duration-300 rounded-sm"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-300 animate-pulse rounded-sm"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-primary flex items-center">
                      <span>{sanitizeTitle(article?.author || 'Unknown Author')}</span>
                      <span className="mx-1">—</span>
                      <span>{article?.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                    </p>
                    <p className="font-semibold text-[18px] mt-1 leading-snug">
                      {article?.title
                        ? article.title.length > 60
                          ? `${article.title.slice(0, 60)}...`
                          : article.title
                        : 'Untitled'}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
});

WorldNewsSection.displayName = 'WorldNewsSection';
