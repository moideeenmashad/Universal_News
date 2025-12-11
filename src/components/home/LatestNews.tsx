'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useEverything } from '@/lib/hooks/useNews';
import { isValidArticle } from '@/lib/utils/validation';
import { formatDate } from '@/lib/utils/date';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ROUTES } from '@/constants/routes';

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
    const allArticles = data?.articles || [];
    return allArticles.filter(isValidArticle);
  }, [data?.articles]);

  const buildArticleUrl = (title: string) => `/${'general'}/${articleUrlName(title)}`;

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
          {/* Top Row Skeleton */}
          <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2 rounded">
            {/* Large Featured Article Skeleton */}
            <div className="rounded-sm bg-white relative">
              <div className="overflow-hidden relative rounded-sm">
                <div className="h-[490px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
              </div>
              <div className="absolute bottom-[40px] left-[26px] p-[20px]">
                <div className="mb-2 h-[28px] w-3/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-[16px] w-1/3 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Two Stacked Articles Skeleton on Right */}
            <div>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-2 mb-[30px] bg-white rounded-sm"
                >
                  <div className="flex items-center">
                    <div className="grid gap-y-[12px]">
                      <div className="h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse"></div>
                      <div className="h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse"></div>
                      <div className="h-[16px] w-[100px] rounded-sm bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row Skeleton */}
          <div className="mt-[14px] gap-x-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-sm bg-white">
                <div className="h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                <div className="mt-[8px]">
                  <div className="h-[20px] w-full rounded-sm bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-[20px] w-full rounded-sm bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-[12px] w-1/3 rounded-sm bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load news.'} />
      ) : articles.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <>
          {/* Top Row */}
          <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2 rounded">
            {/* 1) Large Featured Article (using articles[1]) */}
            <Link
              href={articles[1] ? buildArticleUrl(articles[1].title) : '#'}
              className="rounded-sm bg-white relative block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={articles[1] ? `Read article: ${articles[1].title}` : 'Article link'}
            >
              <div className="overflow-hidden relative rounded-sm">
                {/* Overlay for darkening the image */}
                <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
                {articles[1]?.urlToImage ? (
                  <img
                    src={articles[1].urlToImage}
                    alt={articles[1].title || 'news thumbnail'}
                    className="h-[490px] rounded-sm w-full object-cover transition-transform ease-in-out duration-300 hover:scale-105 filter brightness-75"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[490px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                )}
              </div>
              <div className="absolute bottom-[40px] left-[26px] p-[20px] z-20">
                <h3 className="mb-2 text-[22px] font-bold text-white underline">
                  {articles[1]?.title ? (
                    articles[1].title
                  ) : (
                    <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                  )}
                </h3>
                <p className="text-white">
                  {articles[1]?.publishedAt ? (
                    formatDate(articles[1].publishedAt, 'MMM d, yyyy')
                  ) : (
                    <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                  )}
                </p>
              </div>
            </Link>

            {/* 2 & 3) Two Stacked Articles on the Right */}
            <div>
              {[2, 3].map((i) => (
                <Link
                  key={i}
                  href={articles[i] ? buildArticleUrl(articles[i].title) : '#'}
                  className="grid grid-cols-2 md:grid-cols-2 mb-[30px] bg-white rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={articles[i] ? `Read article: ${articles[i].title}` : 'Article link'}
                >
                  <div className="flex items-center">
                    <div className="grid gap-y-[12px]">
                      {articles[i]?.title ? (
                        <h3 className="mb-1 text-[18px] font-semibold text-gray-800">
                          {articles[i].title.length > 50
                            ? articles[i].title.slice(0, 51) + '...'
                            : articles[i].title}
                        </h3>
                      ) : (
                        <div className="skeleton">
                          <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                          <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                        </div>
                      )}
                      {articles[i]?.publishedAt ? (
                        <p className="text-xs font-normal">
                          {formatDate(articles[i].publishedAt, 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <div className="block h-[20px] w-[100px] rounded-sm bg-gray-200 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  {articles[i]?.urlToImage ? (
                    <div className="image-container overflow-hidden relative rounded-sm">
                      <img
                        src={articles[i].urlToImage}
                        alt={articles[i].title || 'news thumbnail'}
                        className="h-[230px] w-full rounded-sm object-cover transition-transform ease-in-out duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Row (Articles #4, #5, #6) */}
          <div className="mt-[14px] gap-x-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
            {[4, 5, 6].map((i) => (
              <Link
                key={i}
                href={articles[i] ? buildArticleUrl(articles[i].title) : '#'}
                className="overflow-hidden rounded-sm bg-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={articles[i] ? `Read article: ${articles[i].title}` : 'Article link'}
              >
                {articles[i]?.urlToImage ? (
                  <div className="image-container overflow-hidden relative rounded-sm">
                    <img
                      src={articles[i].urlToImage}
                      alt={articles[i].title || 'news thumbnail'}
                      className="h-[230px] w-full rounded-sm object-cover transition-transform ease-in-out duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                )}
                <div className="mt-[8px]">
                  {articles[i]?.title ? (
                    <h3 className="mb-1 text-[18px] font-semibold text-gray-800">
                      {articles[i].title.length > 80
                        ? articles[i].title.slice(0, 80) + '...'
                        : articles[i].title}
                    </h3>
                  ) : (
                    <div className="block h-[20px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                  )}

                  {articles[i]?.publishedAt ? (
                    <p className="text-xs font-normal mt-[8px]">
                      {formatDate(articles[i].publishedAt, 'MMM d, yyyy')}
                    </p>
                  ) : (
                    <div className="block h-[12px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

LatestNews.displayName = 'LatestNews';
