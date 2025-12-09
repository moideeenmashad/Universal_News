'use client';

import { useRef, useEffect, useMemo } from 'react';
import { BsArrowRightCircle } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeTime } from '@/lib/utils/date';
import { useLatestNews } from '@/lib/hooks/useNews';
import { isValidNewsDataArticle } from '@/lib/utils/validation';
import { getShimmerBlurDataURL, getFallbackImageUrl } from '@/lib/utils/image';
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
    const article = data?.results?.[1];
    return article && isValidNewsDataArticle(article) ? article : null;
  }, [data?.results]);



  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
      >
        <div className="animate-pulse" aria-hidden="true" role="presentation">
          {/* Image Skeleton */}
          <div className="relative mb-6 overflow-hidden rounded-sm">
            <div className="h-[400px] md:h-[580px] w-full skeleton-shimmer relative">
              {/* Live Badge Skeleton */}
              <div className="absolute top-[18px] left-[18px] bg-white rounded-sm px-3 py-3 flex items-center gap-2">
                <div className="w-2 h-2 skeleton-dark rounded-full"></div>
                <div className="h-3 skeleton-dark rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Date Skeleton */}
          <div className="flex justify-end mb-3">
            <div className="h-3 skeleton-shimmer rounded w-32"></div>
          </div>

          {/* Title and Link Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-3 space-y-3">
              <div className="h-8 skeleton-shimmer rounded w-full"></div>
              <div className="h-8 skeleton-shimmer rounded w-3/4"></div>
            </div>
            <div className="flex items-start justify-end">
              <div className="h-5 skeleton-shimmer rounded w-24"></div>
            </div>
          </div>
        </div>
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

  return (
    <div
      ref={containerRef}
      className="live-article-container mx-auto max-w-screen-xl relative mb-[100px] px-4 md:px-0"
    >
      <article className="article-container mb-[24px]">
        <div className="image-container mb-[24px] overflow-hidden relative rounded-sm">
          <div className="relative h-[400px] md:h-[580px] w-full">
            <Image
              src={latestNews.image_url || getFallbackImageUrl(1200, 580, 'Latest News')}
              alt={latestNews.title || 'Latest news article'}
              fill
              className="object-cover hover:scale-105 ease-in-out transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
              placeholder="blur"
              blurDataURL={getShimmerBlurDataURL()}
            />
          </div>
          <span
            className="absolute top-[18px] left-[18px] bg-white text-xs font-medium px-[12px] py-[12px] rounded-sm flex items-center"
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
          <time dateTime={latestNews.pubDate}>{formatRelativeTime(latestNews.pubDate)}</time>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-3">
            <h1 className="font-semibold text-2xl md:text-[36px] leading-tight md:leading-[49px]">
              {latestNews.title}
            </h1>
          </div>
          <div className="flex items-start justify-end md:justify-end">
            <Link
              className="flex items-center text-sm link hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              href={articleUrl}
              aria-label={`Read article: ${latestNews.title}`}
            >
              Read Article
              <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
