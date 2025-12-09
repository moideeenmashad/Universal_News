/**
 * GraphQL-style News Service
 * This provides a GraphQL-like interface for fetching news with field selection
 * Only fetches and returns the fields you specify, reducing data transfer
 */

import { NEWS_API_KEY, NEWS_API_BASE_URL } from '@/constants/config';
import type { NewsArticle } from '@/types/news';

// Define available fields for articles
export type ArticleField = 
  | 'source'
  | 'author'
  | 'title'
  | 'description'
  | 'url'
  | 'urlToImage'
  | 'publishedAt'
  | 'content';

export interface GraphQLQueryOptions {
  fields?: ArticleField[]; // Fields to include in response
  category?: string;
  country?: string;
  query?: string;
  language?: string;
  pageSize?: number;
  revalidate?: number;
}

export interface GraphQLNewsResponse {
  articles: Partial<NewsArticle>[];
  totalResults: number;
}

/**
 * Filters article to only include requested fields
 */
function selectFields(
  article: NewsArticle,
  fields?: ArticleField[]
): Partial<NewsArticle> {
  if (!fields || fields.length === 0) {
    return article; // Return all fields if none specified
  }

  const selected: Partial<NewsArticle> = {};
  
  fields.forEach(field => {
    if (field in article) {
      (selected as any)[field] = article[field];
    }
  });

  return selected;
}

/**
 * GraphQL-style query for top headlines
 * Only returns the fields you specify
 */
export async function queryTopHeadlines(
  options: GraphQLQueryOptions = {}
): Promise<GraphQLNewsResponse> {
  const {
    fields,
    category,
    country = 'us',
    pageSize = 20,
    revalidate = 60,
  } = options;

  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    country,
    pageSize: pageSize.toString(),
    apiKey: NEWS_API_KEY,
  });

  if (category) {
    params.append('category', category);
  }

  const url = `${NEWS_API_BASE_URL}/top-headlines?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to fetch headlines');
  }

  // Filter articles to only include requested fields
  const filteredArticles = data.articles.map((article: NewsArticle) =>
    selectFields(article, fields)
  );

  return {
    articles: filteredArticles,
    totalResults: data.totalResults || filteredArticles.length,
  };
}

/**
 * GraphQL-style query for searching articles
 * Only returns the fields you specify
 */
export async function queryEverything(
  options: GraphQLQueryOptions = {}
): Promise<GraphQLNewsResponse> {
  const {
    fields,
    query,
    language = 'en',
    pageSize = 20,
    revalidate = 60,
  } = options;

  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY is not configured');
  }

  if (!query) {
    throw new Error('Query parameter is required');
  }

  const params = new URLSearchParams({
    q: query,
    language,
    pageSize: pageSize.toString(),
    apiKey: NEWS_API_KEY,
  });

  const url = `${NEWS_API_BASE_URL}/everything?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to fetch articles');
  }

  // Filter articles to only include requested fields
  const filteredArticles = data.articles.map((article: NewsArticle) =>
    selectFields(article, fields)
  );

  return {
    articles: filteredArticles,
    totalResults: data.totalResults || filteredArticles.length,
  };
}

/**
 * GraphQL-style query for search suggestions
 * Only returns minimal fields needed for autocomplete
 */
export async function querySearchSuggestions(
  query: string,
  limit: number = 5
): Promise<Partial<NewsArticle>[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const result = await queryEverything({
      query: query.trim(),
      pageSize: limit,
      revalidate: 30,
      // Only fetch fields needed for suggestions
      fields: ['title', 'description', 'url', 'urlToImage', 'publishedAt'],
    });

    return result.articles;
  } catch (error) {
    console.error('Search suggestions error:', error);
    return [];
  }
}

// Example usage:
/*
// Fetch only title and image for a grid view
const headlines = await queryTopHeadlines({
  category: 'technology',
  fields: ['title', 'urlToImage', 'url'],
  pageSize: 10,
});

// Fetch full article details
const fullArticle = await queryEverything({
  query: 'artificial intelligence',
  fields: ['title', 'description', 'content', 'author', 'publishedAt', 'urlToImage'],
  pageSize: 1,
});

// Minimal data for autocomplete
const suggestions = await querySearchSuggestions('bitcoin', 5);
*/
