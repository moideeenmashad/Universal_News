'use client';

import { useMemo } from 'react';
import { NewsList } from './NewsList';
import { useTopHeadlines, useLatestNews } from '@/features/news/hooks/useNews';
import { useInfiniteScroll } from '@/shared/hooks';
import { isValidCategory, isValidArticle, removeDuplicateArticles } from '@/shared/utils';
import type { NewsArticle, NewsProps } from '@/shared/types';

export const News = ({ category, title }: NewsProps) => {
  const isPodcastCategory = category === 'podcasts';

  const actualCategory = useMemo(() => {
    if (category === 'world-news' || isPodcastCategory) return undefined;
    return isValidCategory(category) ? category : undefined;
  }, [category, isPodcastCategory]);

  const { data: newsData, isLoading: isLoadingNews, error: newsError } = useTopHeadlines(actualCategory, 'us', 20);
  const { data: podcastData, isLoading: isLoadingPodcast, error: podcastError } = useLatestNews('podcast');

  const articles = useMemo(() => {
    let transformed: NewsArticle[] = [];

    if (isPodcastCategory) {
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
          source: { name: podcast.source_name || 'Unknown' },
          content: podcast.content,
          article_id: podcast.article_id,
        }))
        .filter(isValidArticle);
    } else {
      if (!newsData?.articles) return [];
      transformed = newsData.articles
        .filter((article) => article?.title && article.title.trim().length > 0)
        .map((article) => ({ ...article, title: article.title.trim() }))
        .filter(isValidArticle);
    }

    return removeDuplicateArticles(transformed);
  }, [isPodcastCategory, newsData?.articles, podcastData]);

  const isLoading = isPodcastCategory ? isLoadingPodcast : isLoadingNews;
  const error = isPodcastCategory ? podcastError : newsError;

  const { visibleCount, lastItemRef, hasMore } = useInfiniteScroll({
    totalCount: articles.length,
    resetKey: category,
  });

  const visibleArticles = useMemo(() => articles.slice(0, visibleCount), [articles, visibleCount]);

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
      lastArticleRef={lastItemRef}
      hasMore={hasMore}
    />
  );
};
