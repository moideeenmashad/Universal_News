'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useTopHeadlines } from '@/lib/hooks/useNews';
import { isValidArticle, sanitizeTitle } from '@/lib/utils/validation';
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
    return allArticles.filter(isValidArticle).slice(0, 4);
  }, [data?.articles]);

  return (
    <div className="mx-auto max-w-screen-xl mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link
            className="flex items-center text-sm link hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            href={ROUTES.TECHNOLOGY}
            aria-label="View all technology news"
          >
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {articles.map((article, index) => {
            const articleSlug = slugify(article.title);
                        const articleUrl = `/${articleSlug}`;

            return (
              <Link
                key={article.url || `tech-${index}`}
                href={articleUrl}
                className="flex flex-col hover:opacity-90 transition-opacity group"
              >
                <div className="relative w-full h-[200px] mb-3 overflow-hidden rounded-sm">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title || 'Technology news thumbnail'}
                      fill
                      className="object-cover group-hover:scale-105 ease-in-out transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-primary flex items-center mb-1">
                    <span>{sanitizeTitle(article.author || 'Unknown Author')}</span>
                    <span className="mx-1">—</span>
                    <span>{article.publishedAt ? formatDate(article.publishedAt, 'MMM d, yyyy') : 'Date Unavailable'}</span>
                  </p>
                  <h3 className="font-semibold text-base leading-tight text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
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

