'use client';

import { useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';
import { ROUTES } from '@/constants/routes';
import { useLatestNews } from '@/lib/hooks/useNews';
import { slugify } from '@/lib/utils/string';
import { ErrorMessage } from '../ui/ErrorMessage';

interface PodcastsSectionProps {
  title?: string;
}

/**
 * PodcastsSection component - Displays podcast articles in a grid layout
 * Fetches data from NewsData.io API with query "podcast"
 */
export const PodcastsSection = memo(({ title = 'PODCASTS' }: PodcastsSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useLatestNews('podcast');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      () => {
        // Data will be fetched automatically
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const podcasts = useMemo(() => {
    if (!data?.results) return [];
    // Filter out invalid podcasts and limit to 6
    return data.results
      .filter((podcast) => podcast?.title && podcast?.image_url)
      .slice(0, 6);
  }, [data]);

  // Generate a random duration between 5-15 minutes for demo purposes
  const getRandomDuration = (index: number) => {
    const durations = [10, 8, 12, 9, 6, 10];
    return durations[index % durations.length];
  };

  // Get author name from creator array or use source name
  const getAuthor = (podcast: typeof podcasts[0]) => {
    if (podcast?.creator && podcast.creator.length > 0 && podcast.creator[0]) {
      return podcast.creator[0];
    }
    return podcast?.source_name || 'Unknown Author';
  };

  return (
    <div className="mx-auto max-w-screen-xl mb-12 md:mb-[100px] px-4 md:px-0" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-6 md:mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-primary uppercase">{title}</h2>
        <div className="flex items-start justify-end">
          <Link
            className="flex items-center text-sm link hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            href={ROUTES.PODCASTS}
            aria-label="View all podcasts"
          >
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={`skeleton-${i}`} className="flex gap-4">
              <div className="w-[120px] h-[120px] flex-shrink-0 bg-gray-200 animate-pulse rounded-sm"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="pt-8">
          <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load podcasts.'} />
        </div>
      ) : podcasts.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-gray-600 text-lg">No podcasts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcasts.map((podcast, index) => {
            const author = getAuthor(podcast);
            const duration = getRandomDuration(index);
            const podcastSlug = slugify(podcast.title);
            const podcastUrl = `/podcasts/${podcastSlug}`;

            return (
              <Link
                key={podcast.article_id || `podcast-${index}`}
                href={podcastUrl}
                className="flex gap-4 hover:opacity-90 transition-opacity"
              >
                {/* Image */}
                <div className="w-[120px] h-[120px] flex-shrink-0 relative overflow-hidden rounded-sm">
                  {podcast.image_url ? (
                    <Image
                      src={podcast.image_url}
                      alt={podcast.title || 'Podcast thumbnail'}
                      fill
                      className="object-cover hover:scale-105 ease-in-out transition-transform duration-300"
                      sizes="120px"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-tight mb-2 text-gray-900 line-clamp-2">
                      {podcast.title || 'Untitled Podcast'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                      {podcast.description || 'No description available.'}
                    </p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-auto">
                    {duration} Minutes — {author}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

PodcastsSection.displayName = 'PodcastsSection';

