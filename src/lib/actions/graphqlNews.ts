'use server';

import type { NewsArticle, NewsArticleField } from '@/types/news';
import { graphqlNewsService } from '../api/graphqlNews';

export async function getTopHeadlinesGraphQL(
  category?: string,
  country: string = 'us',
  pageSize: number = 20,
  fields?: NewsArticleField[]
): Promise<NewsArticle[]> {
  try {
    return await graphqlNewsService.getTopHeadlines(category, {
      country,
      pageSize,
      fields,
    });
  } catch (error) {
    console.error('Error in getTopHeadlinesGraphQL:', error);
    return [];
  }
}

export async function getEverythingGraphQL(
  query: string,
  pageSize: number = 20,
  language: string = 'en',
  domains?: string,
  fields?: NewsArticleField[]
): Promise<NewsArticle[]> {
  try {
    return await graphqlNewsService.searchArticles(query, {
      pageSize,
      language,
      domains,
      fields,
    });
  } catch (error) {
    console.error('Error in getEverythingGraphQL:', error);
    return [];
  }
}

export async function getSearchSuggestionsGraphQL(
  query: string,
  limit: number = 5,
  fields?: NewsArticleField[]
): Promise<NewsArticle[]> {
  try {
    return await graphqlNewsService.getSearchSuggestions(query, limit, fields);
  } catch (error) {
    console.error('Error in getSearchSuggestionsGraphQL:', error);
    return [];
  }
}

