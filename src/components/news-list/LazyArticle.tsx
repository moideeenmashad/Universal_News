'use client';

import { useRef, useEffect, useState, useMemo, memo, useCallback } from 'react';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';
import Image from 'next/image';
import { BsDashLg } from 'react-icons/bs';
import { slugify } from '@/lib/utils/string';
import { sanitizeTitle, isValidArticle } from '@/lib/utils/validation';
import { getPlaceholderImage } from '@/lib/utils/placeholder';
import type { NewsArticle } from '@/types/news';

interface LazyArticleProps {
  article: NewsArticle;
  index: number;
  category: string;
  onVisible?: () => void;
}

const MAX_TITLE_LENGTH = 60;

export const LazyArticle = memo(({ article, index, category, onVisible }: LazyArticleProps) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!articleRef.current || !isValidArticle(article)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true);
            onVisible?.();
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
  }, [article, hasBeenVisible, onVisible]);

  const articleSlug = useMemo(() => slugify(article.title), [article.title]);
  const articleUrl = useMemo(() => `/${category}/${articleSlug}`, [category, articleSlug]);

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

  // Only render content when visible or has been visible
  if (!hasBeenVisible) {
    return (
      <article
        ref={articleRef}
        className="rounded-md cursor-pointer group min-h-[400px]"
        aria-label="Loading article"
      >
        <div className="h-48 md:h-64 w-full skeleton-shimmer rounded-sm mb-3"></div>
        <div className="h-6 skeleton-shimmer rounded w-2/3 mb-2"></div>
        <div className="h-4 skeleton-shimmer rounded w-1/3"></div>
      </article>
    );
  }

  return (
    <article
      ref={articleRef}
      className="rounded-md cursor-pointer group"
      aria-label={article.title}
    >
      <Link
        href={articleUrl}
        className="block hover:opacity-90 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md [&_img]:object-cover [&_img]:group-hover:scale-105 [&_img]:transition-transform [&_img]:duration-300"
        aria-label={`Read article: ${article.title}`}
        prefetch={index < 6}
      >
        <div className="image-container overflow-hidden relative rounded-sm mb-3">
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={article.urlToImage || getPlaceholderImage(300, 300)}
              alt={article.title || 'News article image'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold line-clamp-2 mb-2 leading-snug">
          {truncatedTitle}
        </h3>
        <div className="flex items-center text-[10px] sm:text-xs text-primary mt-2 gap-x-[8px]">
          <span className="truncate">{formattedAuthor}</span>
          <BsDashLg className="flex-shrink-0" aria-hidden="true" />
          <time dateTime={article.publishedAt} className="flex-shrink-0">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
});

LazyArticle.displayName = 'LazyArticle';
