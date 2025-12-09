'use client';

import { PiCalendarLight } from 'react-icons/pi';
import { formatDate } from '@/lib/utils/date';
import Image from 'next/image';
import { useArticleByTitleGraphQL, useArticleByTitleUniversalGraphQL } from '@/lib/hooks/useGraphQLNews';
import { isValidArticle } from '@/lib/utils/validation';
import { getShimmerBlurDataURL, getFallbackImageUrl } from '@/lib/utils/image';
import { getSafeImageUrl } from '@/lib/utils/imageConfig';
import { ErrorMessage } from '../ui/ErrorMessage';
import { useState, useCallback, useMemo } from 'react';

interface NewsDetailsProps {
  category: string;
  title: string;
  searchQuery?: string;
}

export const NewsDetails = ({ category, title, searchQuery }: NewsDetailsProps) => {
  // Using GraphQL for better performance
  const { data: categoryArticle, isLoading: isLoadingCategory, error: categoryError } = useArticleByTitleGraphQL(category, title);
  const { data: universalArticle, isLoading: isLoadingUniversal } = useArticleByTitleUniversalGraphQL(
    title,
    searchQuery
  );

  const article = categoryArticle || universalArticle;
  const isLoading = isLoadingCategory || isLoadingUniversal;
  const error = categoryError;

  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageSrc = useMemo(() => {
    if (!article) return getFallbackImageUrl(1200, 800, 'Article Image');
    if (imageError) {
      return getFallbackImageUrl(1200, 800, 'Article Image');
    }
    const fallback = getFallbackImageUrl(1200, 800, 'Article Image');
    return getSafeImageUrl(article.urlToImage, fallback);
  }, [imageError, article]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8" aria-label="Loading article">
        <div className="animate-pulse" aria-hidden="true" role="presentation">
          <div className="grid grid-cols-1 lg:grid-cols-4 mb-6">
            <div className="col-span-3">
              {/* Image Skeleton */}
              <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
                <div className="w-full h-full skeleton-shimmer"></div>
              </div>

              {/* Author Info Skeleton */}
              <div className="border-y-2 border-gray-200 py-4 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 skeleton-shimmer rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 skeleton-shimmer rounded w-32"></div>
                  <div className="h-4 skeleton-shimmer rounded w-40"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-8 skeleton-shimmer rounded w-full"></div>
                  <div className="h-8 skeleton-shimmer rounded w-5/6"></div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-6"></div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="h-4 skeleton-shimmer rounded w-full"></div>
                  <div className="h-4 skeleton-shimmer rounded w-full"></div>
                  <div className="h-4 skeleton-shimmer rounded w-4/5"></div>
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-3 mt-6">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={`para-${i}`} className="space-y-2">
                      <div className="h-4 skeleton-shimmer rounded w-full"></div>
                      <div className="h-4 skeleton-shimmer rounded w-full"></div>
                      <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
                    </div>
                  ))}
                </div>

                {/* Link Skeleton */}
                <div className="mt-6">
                  <div className="h-5 skeleton-shimmer rounded w-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load article. Please try again.';
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage message={errorMessage} />
      </section>
    );
  }

  if (!article || !isValidArticle(article)) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
        <ErrorMessage message="Article not found." />
      </section>
    );
  }

  const authorName = article.author || article.source?.name || 'Unknown Author';

  return (
    <article className="mx-auto max-w-screen-xl px-4 md:px-0 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={article.title || 'Article image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              placeholder="blur"
              blurDataURL={getShimmerBlurDataURL()}
              onError={handleImageError}
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
                placeholder="blur"
                blurDataURL={getShimmerBlurDataURL()}
              />
            </div>
            <div className="article-profile min-w-0">
              <p className="text-base md:text-lg uppercase font-bold truncate">{authorName}</p>
              <div className="flex items-center text-sm text-gray-600">
                <PiCalendarLight className="mr-[6px] flex-shrink-0" aria-hidden="true" />
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt, 'EEEE, MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{article.title}</h1>
            <hr className="border-b-1 border-primary mb-6" aria-hidden="true" />
            <div className="prose max-w-none">
              {article.description && (
                <p className="text-base md:text-lg leading-relaxed mb-4">{article.description}</p>
              )}
              {article.content && (
                <div
                  className="text-base md:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label={`Read full article on ${article.source?.name || 'source website'}`}
                >
                  Read full article on source website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
