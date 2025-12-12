'use client';

import { useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useTopHeadlines } from '@/lib/hooks/useNews';
import { formatRelativeTime } from '@/lib/utils/date';
import { getPlaceholderImage } from '@/lib/utils/placeholder';
import { isValidArticle } from '@/lib/utils/validation';
import { ErrorMessage } from '../ui/ErrorMessage';
import { FeaturedArticleSkeleton } from '../ui/FeaturedArticleSkeleton';

interface LiveUpdatesSectionProps {
  articleUrlName: (text: string) => string;
}

export const LiveUpdatesSection = ({ articleUrlName }: LiveUpdatesSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Fetch latest news from NewsAPI (public API)
  const { data, isLoading, error } = useTopHeadlines(undefined, 'us', 20);

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

  const articles = data?.articles ?? [];
  const latestNews = useMemo(() => {
    if (!articles.length) return null;
    // Prefer valid article, otherwise take the first available with a title
    const firstValid = articles.find((article) => isValidArticle(article));
    if (firstValid) return firstValid;
    const fallback = articles.find((article) => article?.title);
    return fallback || null;
  }, [articles]);

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
        className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0 pt-8"
      >
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (!latestNews) {
    return null;
  }

  const articleSlug = articleUrlName(latestNews.title);
  const articleUrl = `/${articleSlug}`;
  const publishedRelative = formatRelativeTime(latestNews.publishedAt);

  return (
    <div
      ref={containerRef}
      className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
    >
      <Link
        href={articleUrl}
        className="article-container mb-[24px] block hover:opacity-95 transition-opacity"
        aria-label={`Read article: ${latestNews.title}`}
      >
        <article>
          <div className="image-container mb-[24px] overflow-hidden relative rounded-sm">
            <div className="relative h-[420px] md:h-[560px] w-full">
              <Image
                src={latestNews.urlToImage || getPlaceholderImage(1200, 580)}
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

          <div className="flex justify-end mb-[12px] text-xs text-gray-600">
            <time dateTime={latestNews.publishedAt}>{publishedRelative}</time>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-3">
              <h1 className="font-semibold text-[36px] leading-[49px]">{latestNews.title}</h1>
            </div>
            <div className="flex items-start justify-end">
              <div className="flex items-center text-sm link">
                Read Article
                <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

