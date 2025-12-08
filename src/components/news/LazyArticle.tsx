'use client';

import { useRef, useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';
import Image from 'next/image';
import { BsDashLg } from 'react-icons/bs';
import { slugify } from '@/lib/utils/string';
import { sanitizeTitle, isValidArticle } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';

interface LazyArticleProps {
  article: NewsArticle;
  index: number;
  category: string;
  onVisible?: () => void;
}

const MAX_TITLE_LENGTH = 60;

export const LazyArticle = ({ article, index, category, onVisible }: LazyArticleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!articleRef.current || !isValidArticle(article)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!hasBeenVisible) {
              setHasBeenVisible(true);
              onVisible?.();
            }
          } else {
            setIsVisible(false);
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

  if (!isValidArticle(article)) return null;

  const articleSlug = slugify(article.title);
  const articleUrl = `/${category}/${articleSlug}`;

  const truncateTitle = (title: string): string => {
    const sanitized = sanitizeTitle(title);
    return sanitized.length > MAX_TITLE_LENGTH
      ? sanitized.slice(0, MAX_TITLE_LENGTH) + '...'
      : sanitized;
  };

  const formatAuthor = (author: string | undefined): string => {
    if (!author || author.trim() === '') return 'Unknown';
    return sanitizeTitle(author);
  };

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
        className="block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
        aria-label={`Read article: ${article.title}`}
      >
        <div className="image-container overflow-hidden relative rounded-sm mb-3">
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={article.urlToImage || 'https://via.placeholder.com/300'}
              alt={article.title || 'News article image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={index < 6 ? 'eager' : 'lazy'}
              priority={index < 3}
            />
          </div>
        </div>
        <h3 className="text-lg md:text-xl font-semibold line-clamp-2 mb-2">
          {truncateTitle(article.title)}
        </h3>
        <div className="flex items-center text-xs text-primary mt-2 gap-x-[8px]">
          <span className="truncate">{formatAuthor(article.author)}</span>
          <BsDashLg className="flex-shrink-0" aria-hidden="true" />
          <time dateTime={article.publishedAt} className="flex-shrink-0">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
};

