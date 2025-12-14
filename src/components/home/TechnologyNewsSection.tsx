'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useTopHeadlines } from '@/lib/hooks/useNews';
import { isValidArticle, sanitizeTitle, removeDuplicateArticles } from '@/lib/utils/validation';
import { formatDate } from '@/lib/utils/date';
import { slugify } from '@/lib/utils/string';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ROUTES } from '@/constants/routes';

interface TechnologyNewsSectionProps {
  title: string;
}

export const TechnologyNewsSection = memo(({ title }: TechnologyNewsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useTopHeadlines('technology', 'us', 20);

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
    const validArticles = allArticles.filter(isValidArticle);
    const deduplicated = removeDuplicateArticles(validArticles);
    return deduplicated.slice(0, 4);
  }, [data?.articles]);

  return (
    <div className="mx-auto max-w-screen-xl mb-12 md:mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-6 md:mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link
            className="flex items-center text-sm link hover:opacity-80 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded"
            href={ROUTES.TECHNOLOGY}
            aria-label="View all technology news"
          >
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={`skeleton-${i}`} className="flex flex-col">
              <div className="w-full h-[200px] bg-gray-200 animate-pulse rounded-sm mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="pt-8">
          <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load technology news.'} />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4 md:gap-4">
          {articles.map((article, index) => {
            const articleSlug = slugify(article.title);
            const articleUrl = `/article/${articleSlug}`;

            return (
              <Link
                key={article.url || `tech-${index}`}
                href={articleUrl}
                className="flex flex-col focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md"
              >
                <div className="relative w-full h-[180px] sm:h-[200px] mb-3 overflow-hidden rounded-sm shadow-sm transition-shadow duration-300 hover:shadow-md">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title || 'Technology news thumbnail'}
                      fill
                      className="object-cover hover:scale-110 ease-in-out transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
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
                    <span className="truncate max-w-[120px] sm:max-w-none">{sanitizeTitle(article.author || 'Unknown Author')}</span>
                    <span className="hidden sm:inline">—</span>
                    <span className="whitespace-nowrap">{article.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                  </p>
                  <h3 className="font-semibold text-sm sm:text-base leading-tight text-gray-900 line-clamp-2">
                    {article.title || 'Untitled'}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

TechnologyNewsSection.displayName = 'TechnologyNewsSection';

