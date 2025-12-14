'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { PiCalendarLight } from 'react-icons/pi';
import { useArticleByTitle, useArticleByTitleUniversal, useLatestNews, useTopHeadlines } from '@/lib/hooks/useNews';
import { formatDate } from '@/lib/utils/date';
import { getPlaceholderImage } from '@/lib/utils/placeholder';
import { slugify } from '@/lib/utils/string';
import { isValidArticle, removeDuplicateArticles } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';
import type { NewsDataArticle } from '@/types/news';
import { ArticleDetailSkeleton } from '../ui/ArticleDetailSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SimilarNews } from './SimilarNews';
import { useArticleStore } from '@/lib/store/articleStore';

interface ContentDetailsProps {
  category?: string;
  title: string;
  type?: 'news' | 'podcast'; // Optional, will auto-detect from category
  searchQuery?: string;
}

type UnifiedContent = {
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  sourceName?: string;
  publishedAt: string;
  url?: string;
  link?: string;
  type: 'news' | 'podcast';
};

const isValidPodcast = (podcast: NewsDataArticle | null | undefined): boolean => {
  return !!(podcast?.title && podcast?.image_url);
};

export const ContentDetails = ({ category, title, type, searchQuery }: ContentDetailsProps) => {
  // Auto-detect type from category if not provided
  const contentType = type || (category === 'podcasts' ? 'podcast' : 'news');
  
  // Get cache functions from Zustand store
  const getCachedArticle = useArticleStore((state) => state.getCachedArticle);
  const setCachedArticle = useArticleStore((state) => state.setCachedArticle);
  
  // Check cache first
  const cachedContent = useMemo(() => 
    getCachedArticle(title, category, contentType),
    [title, category, contentType, getCachedArticle]
  );
  
  // Fetch news article if type is news
  // Note: 'world-news' is not a valid NewsAPI category, so we pass empty string to use universal search
  const validCategory = category && category !== 'podcasts' && category !== 'world-news' ? category : '';
  const { data: categoryArticle, isLoading: isLoadingCategory, error: categoryError } = useArticleByTitle(
    validCategory,
    title
  );
  const { data: universalArticle, isLoading: isLoadingUniversal } = useArticleByTitleUniversal(title, searchQuery);

  // Fetch podcast if type is podcast
  const { data: podcastData, isLoading: isLoadingPodcast, error: podcastError } = useLatestNews('podcast');

  // Fetch similar news articles from the same category (only for news articles)
  // Always call useTopHeadlines to maintain hook order consistency
  // Use undefined for general headlines when category is invalid or world-news
  const similarCategory = contentType === 'news' && category && category !== 'podcasts' && category !== 'world-news' 
    ? category 
    : undefined; // undefined will fetch general headlines
  const { data: similarNewsData, isLoading: isLoadingSimilar } = useTopHeadlines(
    similarCategory,
    'us',
    20 // Fetch more to ensure we have enough after filtering and deduplication
  );

  // Transform data to unified format
  const content: UnifiedContent | null = useMemo(() => {
    // Return cached content if available - this takes priority
    if (cachedContent) {
      return cachedContent;
    }
    
    if (contentType === 'news') {
      const article: NewsArticle | null = categoryArticle || universalArticle;
      if (!article || !isValidArticle(article)) return null;

      return {
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.urlToImage,
        author: article.author,
        sourceName: article.source?.name,
        publishedAt: article.publishedAt,
        url: article.url,
        type: 'news',
      };
    } else {
      // contentType === 'podcast'
      // Podcast
      const results = podcastData?.results ?? [];
      const podcast = results.find((item) => slugify(item.title) === title);
      if (!podcast || !isValidPodcast(podcast)) return null;

      const getAuthor = () => {
        if (podcast?.creator && podcast.creator.length > 0 && podcast.creator[0]) {
          return podcast.creator[0];
        }
        return podcast?.source_name || 'Unknown Author';
      };

      return {
        title: podcast.title,
        description: podcast.description,
        content: podcast.content && podcast.content !== 'ONLY AVAILABLE IN PAID PLANS' ? podcast.content : undefined,
        imageUrl: podcast.image_url,
        author: getAuthor(),
        sourceName: podcast.source_name,
        publishedAt: podcast.pubDate,
        link: podcast.link,
        type: 'podcast',
      };
    }
  }, [contentType, categoryArticle, universalArticle, podcastData, title, cachedContent]);

  // Store content in cache when it's loaded (only if not already cached)
  // Use the slugified title (from URL) as the key, not the actual article title
  useEffect(() => {
    if (content && !cachedContent) {
      setCachedArticle(title, content, category, contentType);
    }
  }, [content, cachedContent, category, contentType, setCachedArticle, title]);

  // Get similar articles (exclude current article) - Must be before early returns to follow Rules of Hooks
  // Use cachedContent if available, otherwise use content
  const currentContent = cachedContent || content;
  const similarArticles = useMemo(() => {
    if (contentType !== 'news' || !currentContent || !currentContent.title) return [];
    if (!similarNewsData?.articles || similarNewsData.articles.length === 0) return [];
    
    const allArticles = similarNewsData.articles.filter(isValidArticle);
    if (allArticles.length === 0) return [];
    
    // Remove duplicates first
    const deduplicated = removeDuplicateArticles(allArticles);
    // Filter out current article by comparing titles (using slugified version for better matching)
    const currentTitleSlug = slugify(currentContent.title);
    const filtered = deduplicated.filter(
      (article) => slugify(article.title) !== currentTitleSlug
    );
    
    // Return up to 3 articles, but ensure we have at least some results
    return filtered.slice(0, 3);
  }, [similarNewsData, currentContent, contentType]);

  // If we have cached content, render it immediately without waiting for API calls
  // This check happens before loading/error states to prevent showing loading when cached
  if (cachedContent) {
    const authorName = cachedContent.author || cachedContent.sourceName || 'Unknown Author';
    const sourceUrl = cachedContent.url || cachedContent.link;
    const sourceLabel = 'Read full article';

    return (
      <article className="mx-auto max-w-screen-xl px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px] ">
          <div className="col-span-3">
            <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
              <Image
                src={cachedContent.imageUrl || getPlaceholderImage(800, 400)}
                alt={cachedContent.title || `${type} image`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                loading="lazy"
              />
            </div>
            <div className="publisher border-y-2 border-primary py-4 flex items-center gap-x-[10px] mb-6">
              <div className="relative size-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  className="object-cover"
                  src="/img/avatar.webp"
                  alt={`${authorName} avatar`}
                  fill
                  sizes="40px"
                  loading="lazy"
                />
              </div>
              <div className="article-profile min-w-0">
                <p className="text-sm sm:text-base md:text-lg uppercase font-bold truncate">{authorName}</p>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <PiCalendarLight className="mr-[6px] flex-shrink-0" aria-hidden="true" />
                  <time dateTime={cachedContent.publishedAt}>
                    {formatDate(cachedContent.publishedAt, 'EEEE, MMMM d, yyyy')}
                  </time>
                </div>
              </div>
            </div>
            <div className="article-content-container">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight sm:leading-snug md:leading-normal">{cachedContent.title}</h1>
              <hr className="border-b-1 border-primary mb-4 md:mb-6" aria-hidden="true" />
              <div className="prose max-w-none">
                {cachedContent.description && (
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-3 md:mb-4">{cachedContent.description}</p>
                )}
                {cachedContent.content ? (
                  <div
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cachedContent.content }}
                  />
                ) : (
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 italic">
                    Full content is available on the source website.
                  </p>
                )}
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label={`${sourceLabel} on ${cachedContent.sourceName || 'source website'}`}
                  >
                    {sourceLabel} on source website →
                  </a>
                )}
              </div>
            </div>
            <hr className="border-b border-gray-100 mt-6 " aria-hidden="true" />
          </div>
        </div>

        {/* Similar News Section - Only for news articles */}
        {contentType === 'news' && (
          <SimilarNews articles={similarArticles} category={category} isLoading={isLoadingSimilar} />
        )}
      </article>
    );
  }

  // Determine loading state - only check if we don't have cached content
  const isLoading = contentType === 'news' ? isLoadingCategory || isLoadingUniversal : isLoadingPodcast;
  const error = contentType === 'news' ? categoryError : podcastError;

  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0" aria-label="Loading content">
        <ArticleDetailSkeleton />
      </section>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : contentType === 'news'
          ? 'Failed to load article. Please try again.'
          : 'Podcast not found.';
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage message={errorMessage} />
      </section>
    );
  }

  if (!content) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage 
          message={contentType === 'news' ? 'The article you are looking for could not be found. It may have been removed or the link is incorrect.' : 'The podcast you are looking for could not be found. It may have been removed or the link is incorrect.'} 
          variant="not-found"
          showHomeLink
        />
      </section>
    );
  }

  const authorName = content.author || content.sourceName || 'Unknown Author';
  const sourceUrl = content.url || content.link;
  const sourceLabel = 'Read full article'; // Unified label for all content types

  return (
    <article className="mx-auto max-w-screen-xl px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px] ">
        <div className="col-span-3">
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={content.imageUrl || getPlaceholderImage(800, 400)}
              alt={content.title || `${type} image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              loading="lazy"
            />
          </div>
          <div className="publisher border-y-2 border-primary py-4 flex items-center gap-x-[10px] mb-6">
            <div className="relative size-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                className="object-cover"
                src="/img/avatar.webp"
                alt={`${authorName} avatar`}
                fill
                sizes="40px"
                loading="lazy"
              />
            </div>
            <div className="article-profile min-w-0">
              <p className="text-sm sm:text-base md:text-lg uppercase font-bold truncate">{authorName}</p>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <PiCalendarLight className="mr-[6px] flex-shrink-0" aria-hidden="true" />
                <time dateTime={content.publishedAt}>
                  {formatDate(content.publishedAt, 'EEEE, MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight sm:leading-snug md:leading-normal">{content.title}</h1>
            <hr className="border-b-1 border-primary mb-4 md:mb-6" aria-hidden="true" />
            <div className="prose max-w-none">
              {content.description && (
                <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-3 md:mb-4">{content.description}</p>
              )}
              {content.content ? (
                <div
                  className="text-sm sm:text-base md:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 italic">
                  Full content is available on the source website.
                </p>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label={`${sourceLabel} on ${content.sourceName || 'source website'}`}
                >
                  {sourceLabel} on source website →
                </a>
              )}
            </div>
          </div>
          <hr className="border-b border-gray-100 mt-6 " aria-hidden="true" />
        </div>
      </div>

      {/* Similar News Section - Only for news articles */}
      {contentType === 'news' && (
        <SimilarNews articles={similarArticles} category={category} isLoading={isLoadingSimilar} />
      )}
    </article>
  );
};

