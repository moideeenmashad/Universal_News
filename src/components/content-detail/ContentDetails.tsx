'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { PiCalendarLight } from 'react-icons/pi';
import { useArticleByTitle, useArticleByTitleUniversal, useLatestNews } from '@/lib/hooks/useNews';
import { formatDate } from '@/lib/utils/date';
import { getPlaceholderImage } from '@/lib/utils/placeholder';
import { slugify } from '@/lib/utils/string';
import { isValidArticle } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';
import type { NewsDataArticle } from '@/types/news';
import { ArticleDetailSkeleton } from '../ui/ArticleDetailSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

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
  
  // Fetch news article if type is news
  const { data: categoryArticle, isLoading: isLoadingCategory, error: categoryError } = useArticleByTitle(
    category && category !== 'podcasts' ? category : '',
    title
  );
  const { data: universalArticle, isLoading: isLoadingUniversal } = useArticleByTitleUniversal(title, searchQuery);

  // Fetch podcast if type is podcast
  const { data: podcastData, isLoading: isLoadingPodcast, error: podcastError } = useLatestNews('podcast');

  const isLoading = contentType === 'news' ? isLoadingCategory || isLoadingUniversal : isLoadingPodcast;
  const error = contentType === 'news' ? categoryError : podcastError;

  // Transform data to unified format
  const content: UnifiedContent | null = useMemo(() => {
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
  }, [contentType, categoryArticle, universalArticle, podcastData, title]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24" aria-label="Loading content">
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
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24">
        <ErrorMessage message={errorMessage} />
      </section>
    );
  }

  if (!content) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24">
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
    <article className="mx-auto max-w-screen-xl px-4 md:px-0 py-8 mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={content.imageUrl || getPlaceholderImage(800, 400)}
              alt={content.title || `${type} image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
          <div className="publisher border-y-2 border-primary py-4 flex items-center gap-x-[10px] mb-6">
            <div className="relative size-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                className="object-cover"
                src="https://i.ibb.co/FZpNSmN/istockphoto-2151669184-612x612-removebg-preview.png"
                alt={`${authorName} avatar`}
                fill
                sizes="40px"
              />
            </div>
            <div className="article-profile min-w-0">
              <p className="text-base md:text-lg uppercase font-bold truncate">{authorName}</p>
              <div className="flex items-center text-sm text-gray-600">
                <PiCalendarLight className="mr-[6px] flex-shrink-0" aria-hidden="true" />
                <time dateTime={content.publishedAt}>
                  {formatDate(content.publishedAt, 'EEEE, MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{content.title}</h1>
            <hr className="border-b-1 border-primary mb-6" aria-hidden="true" />
            <div className="prose max-w-none">
              {content.description && (
                <p className="text-base md:text-lg leading-relaxed mb-4">{content.description}</p>
              )}
              {content.content ? (
                <div
                  className="text-base md:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <p className="text-base md:text-lg leading-relaxed text-gray-600 italic">
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
        </div>
      </div>
    </article>
  );
};

