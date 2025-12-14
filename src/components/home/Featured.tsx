'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import { useTopHeadlines } from '@/lib/hooks/useNews';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { isValidArticle, removeDuplicateArticles } from '@/lib/utils/validation';
import { getPlaceholderImage } from '@/lib/utils/placeholder';

interface FeaturedItem {
  id: number;
  title: string;
  assert: string;
  linkTo: string;
}

const FEATURED_LIST: FeaturedItem[] = [
  {
    id: 1,
    title: 'World News',
    assert: 'Economic policies are shaping international markets',
    linkTo: ROUTES.WORLD_NEWS,
  },
  {
    id: 2,
    title: 'Technology',
    assert: 'The latest trends in AI and innovation',
    linkTo: ROUTES.TECHNOLOGY,
  },
  {
    id: 3,
    title: 'Health',
    assert: 'Analyzing the effects of global health policies',
    linkTo: ROUTES.HEALTH,
  },
  {
    id: 4,
    title: 'Sports',
    assert: 'Effects of cutting-edge wearables in professional sports',
    linkTo: ROUTES.SPORTS,
  },
];

/**
 * Featured component - Displays featured news categories with latest news images
 */
export const Featured = memo(() => {
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { data, isLoading } = useTopHeadlines(undefined, 'us', 20, isVisible);

  // Get valid articles with images
  const articlesWithImages = useMemo(() => {
    if (!data?.articles) return [];
    const validArticles = data.articles.filter((article) => isValidArticle(article) && article.urlToImage);
    const deduplicated = removeDuplicateArticles(validArticles);
    return deduplicated.slice(0, 4);
  }, [data]);

  return (
    <nav
      ref={containerRef}
      className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mx-auto max-w-screen-xl gap-4 md:gap-8 mb-[30px] px-4 md:px-0"
      aria-label="Featured news categories"
    >
      {isLoading ? (
        // Skeleton loading
        FEATURED_LIST.map((item) => (
          <div
            key={`skeleton-${item.id}`}
            className="flex items-center gap-3"
            aria-label="Loading featured category"
          >
            <div className="relative w-20 h-20 flex-shrink-0 skeleton-shimmer rounded-sm"></div>
            <div className="min-w-0 flex-1">
              <div className="h-4 w-20 skeleton-shimmer rounded mb-2"></div>
              <div className="h-3 w-full skeleton-shimmer rounded"></div>
              <div className="h-3 w-3/4 skeleton-shimmer rounded mt-1"></div>
            </div>
          </div>
        ))
      ) : (
        FEATURED_LIST.map((item, index) => {
          const article = articlesWithImages[index];
          const imageUrl = article?.urlToImage || getPlaceholderImage(80, 80);

          return (
            <Link
              href={item.linkTo}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus-visible:outline-2 focus-visible:outline-[#E63946] focus-visible:outline-offset-2 rounded"
              key={item.id}
              aria-label={`Browse ${item.title} news`}
            >
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-sm">
                <Image
                  src={imageUrl}
                  alt={`${item.title} category`}
                  fill
                  className="rounded-sm object-cover"
                  sizes="80px"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm uppercase">{item.title}</p>
                <p className="font-medium text-xs leading-[21px] line-clamp-2">{item.assert}</p>
              </div>
            </Link>
          );
        })
      )}
    </nav>
  );
});

Featured.displayName = 'Featured';
