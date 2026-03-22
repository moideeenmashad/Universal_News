'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useTopHeadlines } from '@/lib/hooks';
import { formatRelativeTime, getPlaceholderImage, getArticleUrl, isValidArticle } from '@/lib/utils';
import { ErrorMessage, FeaturedArticleSkeleton } from '../ui';

export const LiveUpdatesSection = () => {
  // Load immediately since this is in the hero section (above the fold)
  const { data, isLoading, error } = useTopHeadlines(undefined, 'us', 20, true);

  const articles = useMemo(() => {
    const allArticles = data?.articles ?? [];
    // No duplicate checking - return all articles
    return allArticles;
  }, [data?.articles]);
  
  const latestNews = useMemo(() => {
    if (!articles.length) return null;
    // Prefer valid article, otherwise take the first available with a title
    const firstValid = articles.find((article) => isValidArticle(article));
    if (firstValid) return firstValid;
    const fallback = articles.find((article) => article?.title);
    return fallback || null;
  }, [articles]);

  // Check for errors FIRST - if there's an error, show error message instead of skeleton
  if (error) {
    const errorMessage =
      error instanceof Error 
        ? error.message 
        : 'Failed to load news. Please try again later.';
    return (
      <div className="live-article-container mx-auto max-w-screen-xl relative mb-12 md:mb-[100px] px-4 md:px-0 pt-8">
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  // Show skeleton if loading OR if no news yet (to prevent blank screen during transitions)
  if (isLoading || !latestNews) {
    return (
      <div className="live-article-container mx-auto max-w-screen-xl relative mb-12 md:mb-[100px] px-4 md:px-0">
        <FeaturedArticleSkeleton />
      </div>
    );
  }

  const articleUrl = getArticleUrl(latestNews);
  const publishedRelative = formatRelativeTime(latestNews.publishedAt);

  return (
    <div className="live-article-container mx-auto max-w-screen-xl relative mb-12 md:mb-[100px] px-4 md:px-0">
      <Link
        href={articleUrl}
        className="article-container mb-[24px] block hover:opacity-95 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded-md [&_img]:object-cover [&_img]:hover:scale-105 [&_img]:ease-in-out [&_img]:transition-transform [&_img]:duration-300"
        aria-label={`Read article: ${latestNews.title}`}
      >
        <article>
          <div className="image-container mb-4 md:mb-[24px] overflow-hidden relative rounded-sm">
            <div className="relative h-[280px] sm:h-[320px] md:h-[420px] lg:h-[560px] w-full">
              <Image
                src={latestNews.urlToImage || getPlaceholderImage(1200, 580)}
                alt={latestNews.title || 'Latest news article'}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                loading="lazy"
              />
            </div>
            <span
              className="absolute top-3 left-3 sm:top-[18px] sm:left-[18px] bg-white text-[10px] sm:text-xs font-medium px-2 py-1.5 sm:px-[12px] sm:py-[12px] rounded-sm flex items-center shadow-sm"
              aria-label="Live updates"
            >
              <span className="relative flex items-center justify-center mr-1.5 sm:mr-[8px]">
                <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] bg-red-500 rounded-full blink-dot" aria-hidden="true"></span>
                <span
                  className="absolute w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] border border-red-500 rounded-full wave-animation"
                  aria-hidden="true"
                ></span>
              </span>
              Live Updates
            </span>
          </div>

          <div className="flex justify-end mb-3 md:mb-[12px] text-[10px] sm:text-xs text-gray-600">
            <time dateTime={latestNews.publishedAt}>{publishedRelative}</time>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-4">
            <h1 className="font-semibold text-xl sm:text-2xl leading-tight">{latestNews.title}</h1>
            <div className="flex items-center justify-start">
              <div className="flex items-center text-sm sm:text-base link font-medium">
                Read Article
                <BsArrowRightCircle className="ml-2 h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-3">
              <h1 className="font-semibold text-3xl lg:text-[36px] leading-snug md:leading-[49px]">{latestNews.title}</h1>
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

