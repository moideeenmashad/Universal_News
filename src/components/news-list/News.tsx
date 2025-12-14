'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { NewsList } from './NewsList';
import { useTopHeadlines, useLatestNews } from '@/lib/hooks/useNews';
import { isValidCategory, isValidArticle } from '@/lib/utils/validation';
import type { NewsArticle } from '@/types/news';

interface NewsProps {
  category: string;
  title: string;
}

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_COUNT = 5;

export const News = ({ category, title }: NewsProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useRef<HTMLDivElement | null>(null);

  // Handle podcasts differently - use NewsData API
  const isPodcastCategory = category === 'podcasts';
  
  // Validate category for news API
  const actualCategory = useMemo(() => {
    if (category === 'world-news' || isPodcastCategory) return undefined;
    return isValidCategory(category) ? category : undefined;
  }, [category, isPodcastCategory]);

  // Use different hooks based on category
  const { data: newsData, isLoading: isLoadingNews, error: newsError } = useTopHeadlines(actualCategory, 'us', 20);
  const { data: podcastData, isLoading: isLoadingPodcast, error: podcastError } = useLatestNews('podcast');

  // Transform data to unified format
  const articles = useMemo(() => {
    let transformed: NewsArticle[] = [];
    
    if (isPodcastCategory) {
      // Transform podcast data to NewsArticle format for NewsList
      if (!podcastData?.results) return [];
      transformed = podcastData.results
        .filter((podcast) => !podcast.duplicate && podcast?.title && podcast.title.trim().length > 0)
        .map((podcast) => ({
          title: podcast.title.trim(),
          description: podcast.description,
          url: podcast.link || '#',
          urlToImage: podcast.image_url,
          publishedAt: podcast.pubDate,
          author: podcast.creator?.[0] || podcast.source_name,
          source: {
            name: podcast.source_name || 'Unknown',
          },
          content: podcast.content,
          article_id: podcast.article_id,
        }))
        .filter(isValidArticle);
    } else {
      // Filter and validate news articles
      if (!newsData?.articles) return [];
      transformed = newsData.articles
        .filter((article) => article?.title && article.title.trim().length > 0)
        .map((article) => ({
          ...article,
          title: article.title.trim(),
        }))
        .filter(isValidArticle);
    }
    
    // No duplicate checking - return all transformed articles
    return transformed;
  }, [isPodcastCategory, newsData?.articles, podcastData]);

  const isLoading = isPodcastCategory ? isLoadingPodcast : isLoadingNews;
  const error = isPodcastCategory ? podcastError : newsError;

  // Handle intersection observer for infinite scroll
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < articles.length) {
        setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, articles.length));
      }
    },
    [visibleCount, articles.length]
  );

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    if (lastArticleRef.current) {
      observer.current.observe(lastArticleRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersection]);

  // Reset visible count when category changes using setTimeout to avoid setState in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }, 0);
    return () => clearTimeout(timer);
  }, [category]);

  const visibleArticles = useMemo(
    () => articles.slice(0, visibleCount),
    [articles, visibleCount]
  );

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load news. Please try again.'
    : null;

  return (
    <NewsList
      title={title}
      articles={visibleArticles}
      loading={isLoading}
      error={errorMessage}
      category={category}
      lastArticleRef={lastArticleRef}
      hasMore={visibleCount < articles.length}
    />
  );
};
