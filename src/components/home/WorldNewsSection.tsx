'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { ROUTES } from '@/constants/routes';
import { useEverything } from '@/lib/hooks/useNews';
import { formatDate } from '@/lib/utils/date';
import { slugify } from '@/lib/utils/string';
import { isValidArticle, sanitizeTitle } from '@/lib/utils/validation';
import { ErrorMessage } from '../ui/ErrorMessage';

interface WorldNewsSectionProps {
  title: string;
}

export const WorldNewsSection = memo(({ title }: WorldNewsSectionProps) => {
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
    <div className="mx-auto max-w-screen-xl mb-12 md:mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-6 md:mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" href={ROUTES.WORLD_NEWS}>
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <>
          {/* Mobile Skeleton - 2 column grid */}
          <div className="grid grid-cols-2 md:hidden gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={`mobile-skeleton-${i}`} className="flex flex-col">
                <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-sm mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop Skeleton - Original layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
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
        <div className="pt-8">
          <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load news.'} />
        </div>
      ) : articles.length === 0 || !feature ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <>
          {/* Mobile Layout - 2 column grid */}
          <div className="grid grid-cols-2 md:hidden gap-4">
            {articles.slice(0, 4).map((article, index) => {
              const articleSlug = slugify(article.title);
              const articleUrl = `/article/${articleSlug}`;

              return (
                <Link
                  key={article.url || `mobile-world-${index}`}
                  href={articleUrl}
                  className="flex flex-col hover:opacity-90 transition-all duration-300 group transform hover:-translate-y-1"
                >
                  <div className="relative w-full h-[180px] mb-3 overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt={article.title || 'World news thumbnail'}
                        fill
                        className="object-cover group-hover:scale-110 ease-in-out transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col px-1">
                    <p className="text-xs text-primary/70 flex flex-wrap items-center mb-2 gap-1">
                      <span className="truncate max-w-[120px]">{sanitizeTitle(article.author || 'Unknown Author')}</span>
                      <span>—</span>
                      <span className="whitespace-nowrap">{article.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                    </p>
                    <h3 className="font-semibold text-sm leading-tight text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {article.title || 'Untitled'}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Layout - Original featured + side stack */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
            {/* Main Grid Item with Image and Overlay */}
            {feature && (
              <Link
                href={`/article/${slugify(feature.title)}`}
                className="md:row-span-3 md:col-span-2 overflow-hidden rounded-sm relative block hover:opacity-90 transition-opacity"
              >
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
              </Link>
            )}

            {/* Right column cards */}
            {sideStack.length > 0
              ? sideStack.slice(0, 3).map((article, index) => {
                  const articleSlug = slugify(article.title);
                  const articleUrl = `/article/${articleSlug}`;
                  
                  return (
                    <Link
                      key={article.url || `world-${index}`}
                      href={articleUrl}
                      className="grid items-center gap-4 [grid-template-columns:40%_60%] hover:opacity-90 transition-opacity"
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
                    </Link>
                  );
                })
              : null}
          </div>
        </>
      )}
    </div>
  );
});

WorldNewsSection.displayName = 'WorldNewsSection';
