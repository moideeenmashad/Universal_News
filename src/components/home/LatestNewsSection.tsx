'use client';

import { useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { ROUTES } from '@/constants/routes';
import { useLatestNews } from '@/lib/hooks/useNews';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { formatDate } from '@/lib/utils/date';
import { slugify } from '@/lib/utils/string';
import { isValidArticle, sanitizeTitle, removeDuplicateArticles } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';
import { ErrorMessage } from '../ui/ErrorMessage';

interface LatestNewsSectionProps {
  title: string;
}

export const LatestNewsSection = memo(({ title }: LatestNewsSectionProps) => {
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  // Fetch latest news from NewsData.io API
  const { data, isLoading, error } = useLatestNews('latest news', isVisible);

  // Transform NewsDataArticle to NewsArticle format and get first 6 articles (0-5)
  const articles = useMemo(() => {
    if (!data?.results) return [];
    
    // Filter out duplicates from NewsData.io (where duplicate: true)
    const uniqueResults = data.results.filter((item) => !item.duplicate);
    
    const transformed: NewsArticle[] = uniqueResults
      .map((item) => ({
        title: item.title,
        description: item.description,
        url: item.link || '#',
        urlToImage: item.image_url,
        publishedAt: item.pubDate,
        author: item.creator?.[0] || item.source_name,
        source: {
          name: item.source_name || 'Unknown',
        },
        content: item.content,
        // Store article_id for deduplication
        article_id: item.article_id,
      }))
      .filter(isValidArticle);
    
    // Remove duplicates by article_id or title+url
    const deduplicated = removeDuplicateArticles(transformed);
    
    // Get first 6 articles after deduplication
    return deduplicated.slice(0, 6);
  }, [data]);

  // Layout: 0 (feature), 1-2 (side stack), 3-5 (bottom row)
  const feature = articles[0];
  const sideStack = articles.slice(1, 3); // Articles 1, 2
  const bottomRow = articles.slice(3, 6); // Articles 3, 4, 5

  return (
    <div className="mx-auto max-w-screen-xl mb-12 md:mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-6 md:mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded" href={ROUTES.WORLD_NEWS}>
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
          <div className="hidden md:block">
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
          </div>
        </>
      ) : error ? (
        <div className="pt-8">
          <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load news.'} />
        </div>
      ) : articles.length === 0 ? (
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
                  key={article.url || `mobile-latest-${index}`}
                  href={articleUrl}
                  className="flex flex-col hover:opacity-90 transition-all duration-300 group transform hover:-translate-y-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md"
                >
                  <div className="relative w-full h-[180px] mb-3 overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt={article.title || 'Latest news thumbnail'}
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

          {/* Desktop Layout - Original featured + side stack + bottom row */}
          <div className="hidden md:block">
            {/* Top Row */}
            <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2 rounded">
              {/* 1) Large Featured Article (using articles[0]) */}
              {feature && (
                <Link
                  href={`/article/${slugify(feature.title)}`}
                  className="rounded-sm bg-white relative block hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2"
                >
                  <div className="overflow-hidden relative rounded-sm">
                    {/* Overlay for darkening the image */}
                    <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
                    {feature?.urlToImage ? (
                      <img
                        src={feature.urlToImage}
                        alt={feature.title || 'news thumbnail'}
                        className="h-[490px] rounded-sm w-full object-cover transition-transform ease-in-out duration-300 hover:scale-105 filter brightness-75"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-[490px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                    )}
                  </div>
                  <div className="absolute bottom-[40px] left-[26px] p-[20px] z-20">
                    <h3 className="mb-2 text-[22px] font-bold text-white underline leading-tight">
                      {feature?.title ? (
                        feature.title
                      ) : (
                        <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                      )}
                    </h3>
                    <p className="text-white text-base">
                      {feature?.publishedAt ? (
                        formatDate(feature.publishedAt, 'MMM d, yyyy')
                      ) : (
                        <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </Link>
              )}

              {/* 2 & 3) Two Stacked Articles on the Right */}
              <div>
                {sideStack.map((article, idx) => {
                  const articleSlug = slugify(article.title);
                  const articleUrl = `/article/${articleSlug}`;
                  
                  return (
                    <Link
                      key={article.url || `side-${idx}`}
                      href={articleUrl}
                      className="grid grid-cols-2 md:grid-cols-2 mb-[30px] bg-white rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2"
                    >
                      <div className="flex items-center">
                        <div className="grid gap-y-[12px]">
                          {article?.title ? (
                            <h3 className="mb-1 text-[18px] font-semibold text-gray-800 leading-snug line-clamp-2">
                              {article.title.length > 50
                                ? article.title.slice(0, 51) + '...'
                                : article.title}
                            </h3>
                          ) : (
                            <div className="skeleton">
                              <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                              <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                            </div>
                          )}
                          {article?.publishedAt ? (
                            <p className="text-xs font-normal">
                              {formatDate(article.publishedAt, 'MMM d, yyyy')}
                            </p>
                          ) : (
                            <div className="block h-[20px] w-[100px] rounded-sm bg-gray-200 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      {article?.urlToImage ? (
                        <div className="image-container overflow-hidden relative rounded-sm">
                          <img
                            src={article.urlToImage}
                            alt={article.title || 'news thumbnail'}
                            className="h-[230px] w-full rounded-sm object-cover transition-transform ease-in-out duration-300 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row (Articles #4, #5, #6) */}
            <div className="mt-[14px] gap-x-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
              {bottomRow.map((article, index) => {
                const articleSlug = slugify(article.title);
                const articleUrl = `/article/${articleSlug}`;
                
                return (
                  <Link
                    key={article.url || `bottom-${index}`}
                    href={articleUrl}
                    className="overflow-hidden rounded-sm bg-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2"
                  >
                    {article?.urlToImage ? (
                      <div className="image-container overflow-hidden relative rounded-sm">
                        <img
                          src={article.urlToImage}
                          alt={article.title || 'news thumbnail'}
                          className="h-[230px] w-full rounded-sm object-cover transition-transform ease-in-out duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                    )}
                    <div className="mt-[8px]">
                      {article?.title ? (
                        <h3 className="mb-1 text-[18px] font-semibold text-gray-800 leading-snug line-clamp-2">
                          {article.title.length > 80
                            ? article.title.slice(0, 80) + '...'
                            : article.title}
                        </h3>
                      ) : (
                        <div className="block h-[20px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                      )}

                      {article?.publishedAt ? (
                        <p className="text-xs font-normal mt-[8px]">
                          {formatDate(article.publishedAt, 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <div className="block h-[12px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

LatestNewsSection.displayName = 'LatestNewsSection';

