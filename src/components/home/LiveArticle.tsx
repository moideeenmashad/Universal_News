'use client';

import { useRef, useEffect, useMemo } from 'react';
import { BsArrowRightCircle } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/date';
import { useLatestNews } from '@/lib/hooks/useNews';
import { isValidNewsDataArticle, sanitizeTitle } from '@/lib/utils/validation';
import { FeaturedArticleSkeleton } from '../ui/FeaturedArticleSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

interface LiveArticleProps {
  articleUrlName: (text: string) => string;
}

export const LiveArticle = ({ articleUrlName }: LiveArticleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useLatestNews('worldnews');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Data will be fetched automatically
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const latestNews = useMemo(() => {
    if (!data?.results?.length) return null;
    const firstValid = data.results.find((article) => isValidNewsDataArticle(article));
    return firstValid || null;
  }, [data?.results]);

  const readingTime = useMemo(() => {
    const text = `${latestNews?.content || ''} ${latestNews?.description || ''} ${latestNews?.title || ''}`;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
  }, [latestNews?.content, latestNews?.description, latestNews?.title]);

  const primaryCategory = useMemo(() => {
    const category = latestNews?.category?.[0];
    if (!category) return 'World News';
    return sanitizeTitle(category);
  }, [latestNews?.category]);

  const authorName = useMemo(() => {
    const author = latestNews?.creator?.[0];
    if (!author) return 'Unknown';
    return sanitizeTitle(author);
  }, [latestNews?.creator]);

  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
      >
        <FeaturedArticleSkeleton />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Please check your internet connection.';
    return (
      <div
        ref={containerRef}
        className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
      >
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (!latestNews) {
    return null;
  }

  const articleSlug = articleUrlName(latestNews.title);
  const articleUrl = `/world-news/${articleSlug}`;
  const publishedDate = formatDate(latestNews.pubDate, 'MMM d, yyyy');

  return (
    <div
      ref={containerRef}
      className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
    >
      <article className="article-container mb-[24px]">
        <div className="image-container mb-[24px] overflow-hidden relative rounded-sm">
          <div className="relative h-[420px] md:h-[560px] w-full">
            <Image
              src={latestNews.image_url || 'https://via.placeholder.com/1200x580'}
              alt={latestNews.title || 'Latest news article'}
              fill
              className="object-cover hover:scale-105 ease-in-out transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
          <span
            className="absolute top-[18px] left-[18px] bg-white text-xs font-medium px-[12px] py-[12px] rounded-sm flex items-center shadow-sm"
            aria-label="Live updates"
          >
            <span className="relative flex items-center justify-center mr-[8px]">
              <span className="w-[6px] h-[6px] bg-red-500 rounded-full blink-dot" aria-hidden="true"></span>
              <span
                className="absolute w-[16px] h-[16px] border border-red-500 rounded-full wave-animation"
                aria-hidden="true"
              ></span>
            </span>
            Live Updates
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-[11px] uppercase tracking-wide font-semibold bg-gray-100 text-gray-800 rounded-sm">
                {primaryCategory}
              </span>
              <span className="px-3 py-1 text-[11px] uppercase tracking-wide font-semibold bg-gray-100 text-gray-800 rounded-sm">
                {authorName}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600">
              <time dateTime={latestNews.pubDate}>{publishedDate}</time>
              <span aria-hidden="true">•</span>
              <span>{readingTime}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <h1 className="font-semibold text-[26px] md:text-[34px] leading-tight md:leading-[46px] text-primary max-w-4xl">
              {latestNews.title}
            </h1>
            <Link
              className="flex items-center text-sm font-medium text-primary hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              href={articleUrl}
              aria-label={`Read article: ${latestNews.title}`}
            >
              Read Article
              <BsArrowRightCircle className="ml-[8px] h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
