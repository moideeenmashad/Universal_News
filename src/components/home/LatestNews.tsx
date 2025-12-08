'use client';

import { useRef, useEffect, useMemo } from 'react';
import { formatDate } from '@/src/lib/utils/date';
import Link from 'next/link';
import Image from 'next/image';
import { useEverything } from '@/src/lib/hooks/useNews';
import { slugify } from '@/src/lib/utils/string';
import { isValidArticle, sanitizeTitle } from '@/src/lib/utils/validation';
import { ArticleSkeleton } from '../ui/ArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

interface LatestNewsProps {
  title: string;
  articleUrlName: (text: string) => string;
}

const MAX_TITLE_LENGTH = 60;

export const LatestNews = ({ title, articleUrlName }: LatestNewsProps) => {
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


  const formatAuthor = (author: string | undefined): string => {
    if (!author || author.trim() === '') return 'Unknown';
    return sanitizeTitle(author);
  };

  const truncateTitle = (title: string): string => {
    const sanitized = sanitizeTitle(title);
    return sanitized.length > MAX_TITLE_LENGTH
      ? sanitized.slice(0, MAX_TITLE_LENGTH) + '...'
      : sanitized;
  };

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
      ) : articles.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {articles.map((article, index) => {
            const articleSlug = articleUrlName(article.title);
            const articleUrl = `/general/${articleSlug}`;

            return (
              <article
                key={article.url || `article-${index}`}
                className="rounded-md cursor-pointer group"
              >
                <Link
                  href={articleUrl}
                  className="block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  aria-label={`Read article: ${article.title}`}
                >
                  <div className="image-container overflow-hidden relative rounded-sm mb-3">
                    <div className="relative h-48 w-full">
                      <Image
                        src={article.urlToImage || 'https://via.placeholder.com/300'}
                        alt={article.title || 'News article image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading={index < 4 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                  <h3 className="text-base md:text-xl font-semibold line-clamp-2">
                    {truncateTitle(article.title)}
                  </h3>
                  <div className="flex items-center text-xs text-primary mt-2 gap-x-[8px]">
                    <span className="truncate">{formatAuthor(article.author)}</span>
                    <span aria-hidden="true">•</span>
                    <time dateTime={article.publishedAt} className="flex-shrink-0">
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
