'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { ROUTES } from '@/constants/routes';
import { useLatestNews } from '@/lib/hooks/useNews';
import { formatDate } from '@/lib/utils/date';
import { slugify } from '@/lib/utils/string';
import { isValidArticle, sanitizeTitle, removeDuplicateArticles } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';
import { ErrorMessage } from '../ui/ErrorMessage';

interface WorldNewsSectionProps {
  title: string;
}

export const WorldNewsSection = memo(({ title }: WorldNewsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Fetch world news from NewsData.io API
  const { data, isLoading, error } = useLatestNews('world news');

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

  // Transform NewsDataArticle to NewsArticle format and get first 4 articles (0, 1, 2, 3)
  const articles = useMemo(() => {
    if (!data?.results) return [];
    
    // Filter out duplicates from NewsData.io (where duplicate: true)
    const uniqueResults = data.results.filter((item) => !item.duplicate);
    
    // Process more articles to ensure we have enough after filtering
    const transformed: NewsArticle[] = uniqueResults
      .slice(0, 20) // Process first 20 to ensure we get at least 4 valid ones
      .map((item) => ({
        title: item.title || 'Untitled',
        description: item.description,
        url: item.link || '#',
        urlToImage: item.image_url,
        publishedAt: item.pubDate || new Date().toISOString(), // Fallback to current date if missing
        author: item.creator?.[0] || item.source_name,
        source: {
          name: item.source_name || 'Unknown',
        },
        content: item.content,
        // Store article_id for deduplication
        article_id: item.article_id,
      }))
      .filter((article) => {
        // Very lenient validation - only require non-empty title
        return article.title && article.title.trim().length > 0;
      });
    
    // Remove duplicates by article_id or title+url
    const deduplicated = removeDuplicateArticles(transformed);
    
    // Get first 4 articles after deduplication
    // If we have fewer than 4, try to get more from the original results
    if (deduplicated.length < 4 && uniqueResults.length > 20) {
      // Process more articles if we don't have enough
      const additionalTransformed: NewsArticle[] = uniqueResults
        .slice(20, 40) // Process next 20
        .map((item) => ({
          title: item.title || 'Untitled',
          description: item.description,
          url: item.link || '#',
          urlToImage: item.image_url,
          publishedAt: item.pubDate || new Date().toISOString(),
          author: item.creator?.[0] || item.source_name,
          source: {
            name: item.source_name || 'Unknown',
          },
          content: item.content,
          article_id: item.article_id,
        }))
        .filter((article) => article.title && article.title.trim().length > 0);
      
      const additionalDeduplicated = removeDuplicateArticles(additionalTransformed);
      const combined = [...deduplicated, ...additionalDeduplicated];
      return combined.slice(0, 4);
    }
    
    return deduplicated.slice(0, 4);
  }, [data]);

  // Desktop layout: article 0 as featured, articles 1, 2, 3 as side stack
  const feature = articles[0];
  const sideStack = articles.slice(1); // Articles 1, 2, 3 (or however many we have)

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
          {/* Desktop Skeleton - Grid with equal heights */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 min-h-[520px]">
            {/* Main hero skeleton - Same height as side items, 2 columns */}
            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-sm relative h-full min-h-[520px]">
                <div className="w-full h-full rounded-sm bg-gray-200 animate-pulse"></div>
                <div className="absolute top-4 left-4 right-4 p-4 rounded-sm md:w-1/2 bottom-4 grid bg-gray-300/70">
                  <div className="space-y-3">
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
            {/* Side list skeletons - Stacked in flex column with equal heights */}
            <div className="flex flex-col gap-4 h-full">
              {[0, 1, 2].map((i) => (
                <div key={`skeleton-${i}`} className="flex-1 grid items-center gap-4 [grid-template-columns:40%_60%] min-h-[160px]">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
                  <div className="flex flex-col justify-center space-y-2 h-full">
                    <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
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
                  className="flex flex-col hover:opacity-90 transition-all duration-300 group transform hover:-translate-y-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md"
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

          {/* Desktop Layout - Grid with equal row heights */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 min-h-[520px]">
            {/* Top Row: Featured article (2 cols) + First side item (1 col) */}
            <div className="md:col-span-2">
              {feature && (
                <Link
                  href={`/article/${slugify(feature.title)}`}
                  className="block overflow-hidden rounded-sm relative hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 h-full"
                >
                  <div className="overflow-hidden rounded-sm relative h-full">
                    {feature?.urlToImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={feature.urlToImage}
                        alt={feature.title || 'news thumbnail'}
                        className="w-full h-full object-cover hover:scale-105 ease-in-out transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full rounded-sm bg-gray-200 animate-pulse"></div>
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
            </div>
            
            {/* Right column - Stack of 3 items with equal heights */}
            <div className="flex flex-col gap-4">
              {sideStack && sideStack.length > 0
                ? sideStack.slice(0, 3).map((article, index) => {
                    const articleSlug = slugify(article.title);
                    const articleUrl = `/article/${articleSlug}`;
                    
                    return (
                      <Link
                        key={article.url || article.article_id || `world-${index}`}
                        href={articleUrl}
                        className="flex-1 grid items-center gap-4 [grid-template-columns:40%_60%] hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md min-h-0"
                      >
                        <div className="image-container mr-[8px] overflow-hidden rounded-sm relative h-full">
                          {article?.urlToImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-full object-cover object-center hover:scale-105 ease-in-out transition-transform duration-300 rounded-sm"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 animate-pulse rounded-sm"></div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center h-full">
                          <p className="text-xs text-primary flex items-center mb-2">
                            <span>{sanitizeTitle(article?.author || 'Unknown Author')}</span>
                            <span className="mx-1">—</span>
                            <span>{article?.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                          </p>
                          <p className="font-semibold text-[18px] leading-snug line-clamp-3">
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
          </div>
        </>
      )}
    </div>
  );
});

WorldNewsSection.displayName = 'WorldNewsSection';
