'use client';

import { memo, useMemo, useState, useEffect } from 'react';
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
  category?: string; // Category for fetching category-specific articles
}

const FEATURED_LIST: FeaturedItem[] = [
  {
    id: 1,
    title: 'World News',
    assert: 'Economic policies are shaping international markets',
    linkTo: ROUTES.WORLD_NEWS,
    category: undefined, // World news uses everything endpoint, not category
  },
  {
    id: 2,
    title: 'Technology',
    assert: 'The latest trends in AI and innovation',
    linkTo: ROUTES.TECHNOLOGY,
    category: 'technology',
  },
  {
    id: 3,
    title: 'Health',
    assert: 'Analyzing the effects of global health policies',
    linkTo: ROUTES.HEALTH,
    category: 'health',
  },
  {
    id: 4,
    title: 'Sports',
    assert: 'Effects of cutting-edge wearables in professional sports',
    linkTo: ROUTES.SPORTS,
    category: 'sports',
  },
];

/**
 * Featured component - Displays featured news categories with latest news images
 * Each category shows an image from its own category-specific news
 */
export const Featured = memo(() => {
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Ensure component is mounted on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Fetch articles for each category
  const worldNewsData = useTopHeadlines(undefined, 'us', 5, isVisible); // General for world news
  const techData = useTopHeadlines('technology', 'us', 5, isVisible);
  const healthData = useTopHeadlines('health', 'us', 5, isVisible);
  const sportsData = useTopHeadlines('sports', 'us', 5, isVisible);

  // Get first valid article with image for each category
  const categoryArticles = useMemo(() => {
    const getFirstValidArticle = (data: typeof worldNewsData.data) => {
      if (!data?.articles) return null;
      const validArticles = data.articles.filter((article) => isValidArticle(article) && article.urlToImage);
      const deduplicated = removeDuplicateArticles(validArticles);
      return deduplicated[0] || null;
    };

    return {
      world: getFirstValidArticle(worldNewsData.data),
      technology: getFirstValidArticle(techData.data),
      health: getFirstValidArticle(healthData.data),
      sports: getFirstValidArticle(sportsData.data),
    };
  }, [worldNewsData.data, techData.data, healthData.data, sportsData.data]);

  // Show skeleton if component is not mounted yet (prevents hydration mismatch)
  // OR if ANY data source is loading OR if we don't have real articles yet
  // This prevents showing static data with placeholder images before real data loads
  const isLoading = useMemo(() => {
    // Always show skeleton on initial render (server and client) until mounted
    if (!isMounted) return true;
    
    const anyLoading = 
      worldNewsData.isLoading || 
      techData.isLoading || 
      healthData.isLoading || 
      sportsData.isLoading;
    
    // Check if we have at least some real articles loaded
    const hasRealData = 
      categoryArticles.world || 
      categoryArticles.technology || 
      categoryArticles.health || 
      categoryArticles.sports;
    
    // Show skeleton if loading OR if we don't have real data yet
    return anyLoading || !hasRealData;
  }, [
    isMounted,
    worldNewsData.isLoading, 
    techData.isLoading, 
    healthData.isLoading, 
    sportsData.isLoading,
    categoryArticles.world,
    categoryArticles.technology,
    categoryArticles.health,
    categoryArticles.sports
  ]);

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
            className="flex items-center gap-3 animate-pulse"
            aria-label="Loading featured category"
          >
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-sm"></div>
            <div className="min-w-0 flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>
        ))
      ) : (
        FEATURED_LIST.map((item) => {
          // Get the appropriate article for each category
          let article = null;
          if (item.category === 'technology') {
            article = categoryArticles.technology;
          } else if (item.category === 'health') {
            article = categoryArticles.health;
          } else if (item.category === 'sports') {
            article = categoryArticles.sports;
          } else {
            // World News uses general headlines
            article = categoryArticles.world;
          }

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
