import { CACHE_REVALIDATE_SHORT } from '@/constants/config';
import type { NewsApiResponse, NewsArticle } from '@/types/news';
import type { NewsArticleField } from '@/types/news';
import { newsService } from '../api/news';

const REQUIRED_BASE_FIELDS: NewsArticleField[] = ['title', 'url', 'publishedAt'];
const DEFAULT_SUGGESTION_FIELDS: NewsArticleField[] = [
  'title',
  'description',
  'url',
  'urlToImage',
  'publishedAt',
];

const mergeWithRequiredFields = (fields?: NewsArticleField[]): NewsArticleField[] => {
  if (!fields || fields.length === 0) {
    return [];
  }
  const fieldSet = new Set<NewsArticleField>([...REQUIRED_BASE_FIELDS, ...fields]);
  return Array.from(fieldSet);
};

const selectArticleFields = (article: NewsArticle, fields?: NewsArticleField[]): NewsArticle => {
  if (!fields || fields.length === 0) {
    return article;
  }

  const allowedFields = mergeWithRequiredFields(fields) as (keyof NewsArticle)[];
  const selected: Partial<Record<NewsArticleField, unknown>> = {};

  for (const field of allowedFields) {
    const value = article[field];
    if (value !== undefined) {
      selected[field] = value;
    }
  }

  // Ensure required fields are always present with sensible fallbacks
  if (!('title' in selected)) {
    selected.title = article.title;
  }
  if (!('url' in selected)) {
    selected.url = article.url;
  }
  if (!('publishedAt' in selected)) {
    selected.publishedAt = article.publishedAt;
  }

  return selected as NewsArticle;
};

const applyFieldSelection = (
  response: NewsApiResponse,
  fields?: NewsArticleField[]
): NewsApiResponse => {
  if (!fields || fields.length === 0) {
    return response;
  }

  return {
    ...response,
    articles: response.articles.map((article) => selectArticleFields(article, fields)),
  };
};

interface BaseQueryOptions {
  fields?: NewsArticleField[];
  revalidate?: number;
}

interface TopHeadlinesOptions extends BaseQueryOptions {
  category?: string;
  country?: string;
  pageSize?: number;
}

interface EverythingOptions extends BaseQueryOptions {
  query: string;
  pageSize?: number;
  language?: string;
  domains?: string;
}

/**
 * GraphQL-style query for top headlines with field selection
 */
export async function queryTopHeadlines({
  category,
  country = 'us',
  pageSize = 20,
  fields,
  revalidate = CACHE_REVALIDATE_SHORT,
}: TopHeadlinesOptions): Promise<NewsApiResponse> {
  const response = await newsService.getTopHeadlines(category, country, pageSize, revalidate);
  return applyFieldSelection(response, fields);
}

/**
 * GraphQL-style query for "everything" search with field selection
 */
export async function queryEverything({
  query,
  pageSize = 20,
  language = 'en',
  domains,
  fields,
  revalidate = CACHE_REVALIDATE_SHORT,
}: EverythingOptions): Promise<NewsApiResponse> {
  const response = await newsService.getEverything(query, pageSize, language, domains, revalidate);
  return applyFieldSelection(response, fields);
}

/**
 * GraphQL-style query for search suggestions (always minimal fields)
 */
export async function querySearchSuggestions(
  query: string,
  limit: number = 5,
  fields: NewsArticleField[] = DEFAULT_SUGGESTION_FIELDS
): Promise<NewsArticle[]> {
  const suggestions = await newsService.getSearchSuggestions(query, limit);
  return suggestions.map((article) => selectArticleFields(article, fields));
}

