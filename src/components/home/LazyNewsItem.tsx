'use client';

import { useRef, useEffect, useState, useMemo, memo, useCallback } from 'react';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/lib/utils/string';
import { sanitizeTitle, isValidArticle } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';

interface LazyNewsItemProps {
  article: NewsArticle;
  index: number;
  articleUrlName: (text: string) => string;
  baseUrl: string;
}

const MAX_TITLE_LENGTH = 60;

export const LazyNewsItem = memo(({ article, index, articleUrlName, baseUrl }: LazyNewsItemProps) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!articleRef.current || !isValidArticle(article)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // Start loading 200px before entering viewport
      }
    );

    observer.observe(articleRef.current);

    return () => {
      if (articleRef.current) {
        observer.unobserve(articleRef.current);
      }
    };
  }, [article, hasBeenVisible]);

  const articleSlug = useMemo(() => articleUrlName(article.title), [article.title, articleUrlName]);
  const articleUrl = useMemo(() => `${baseUrl}/${articleSlug}`, [baseUrl, articleSlug]);

  const truncateTitle = useCallback((title: string): string => {
    const sanitized = sanitizeTitle(title);
    return sanitized.length > MAX_TITLE_LENGTH
      ? sanitized.slice(0, MAX_TITLE_LENGTH) + '...'
      : sanitized;
  }, []);

  const formatAuthor = useCallback((author: string | undefined): string => {
    if (!author || author.trim() === '') return 'Unknown';
    return sanitizeTitle(author);
  }, []);

  const truncatedTitle = useMemo(() => truncateTitle(article.title), [article.title, truncateTitle]);
  const formattedAuthor = useMemo(() => formatAuthor(article.author), [article.author, formatAuthor]);

  if (!isValidArticle(article)) return null;

  // Show skeleton until visible
  if (!hasBeenVisible) {
    return (
      <article
        ref={articleRef}
        className="rounded-md cursor-pointer group min-h-[300px]"
        aria-label="Loading article"
      >
        <div className="h-48 w-full skeleton-shimmer rounded-sm mb-3"></div>
        <div className="h-5 skeleton-shimmer rounded w-2/3 mb-2"></div>
        <div className="h-3 skeleton-shimmer rounded w-1/3"></div>
      </article>
    );
  }

  return (
    <article ref={articleRef} className="rounded-md cursor-pointer group">
      <Link
        href={articleUrl}
        className="block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
        aria-label={`Read article: ${article.title}`}
        prefetch={index < 4}
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
              priority={index < 2}
            />
          </div>
        </div>
        <h3 className="text-base md:text-xl font-semibold line-clamp-2">
          {truncatedTitle}
        </h3>
        <div className="flex items-center text-xs text-primary mt-2 gap-x-[8px]">
          <span className="truncate">{formattedAuthor}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={article.publishedAt} className="flex-shrink-0">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
});

LazyNewsItem.displayName = 'LazyNewsItem';
