/**
 * Modern News Service using GraphQL-style queries
 * Fetches only the fields you need, reducing data transfer and improving performance
 */

import {
  queryTopHeadlines,
  queryEverything,
  querySearchSuggestions,
  type GraphQLQueryOptions,
  type GraphQLNewsResponse,
} from '@/lib/graphql/newsQueries';
import type { NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';

class GraphQLNewsService {
  /**
   * Fetches top headlines with field selection
   * Only fetches the fields you specify
   */
  async getTopHeadlines(
    category?: string,
    options: Partial<GraphQLQueryOptions> = {}
  ): Promise<NewsArticle[]> {
    try {
      const result = await queryTopHeadlines({
        category,
        country: options.country || 'us',
        pageSize: options.pageSize || 20,
        revalidate: options.revalidate || 60,
        // Fetch all fields by default, but can be customized
        fields: options.fields,
      });

      return result.articles as NewsArticle[];
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw ApiError.fromFetchError(error);
    }
  }

  /**
   * Searches articles with field selection
   */
  async searchArticles(
    query: string,
    options: Partial<GraphQLQueryOptions> = {}
  ): Promise<NewsArticle[]> {
    try {
      const result = await queryEverything({
        query,
        language: options.language || 'en',
        pageSize: options.pageSize || 20,
        revalidate: options.revalidate || 60,
        fields: options.fields,
      });

      return result.articles as NewsArticle[];
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw ApiError.fromFetchError(error);
    }
  }

  /**
   * Gets search suggestions with minimal data
   * Only fetches title, image, and URL for performance
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<NewsArticle[]> {
    try {
      const suggestions = await querySearchSuggestions(query, limit);
      return suggestions as NewsArticle[];
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }

  /**
   * Finds an article by title in a category
   * Fetches full article details
   */
  async getArticleByTitle(
    category: string,
    title: string
  ): Promise<NewsArticle | null> {
    try {
      if (!category || !title) {
        return null;
      }

      const articles = await this.getTopHeadlines(category, {
        pageSize: 20,
        revalidate: 300,
      });

      const { slugify } = await import('@/lib/utils/string');

      const matchedArticle = articles.find((article) => {
        const apiTitleSlug = slugify(article.title);
        return apiTitleSlug === title;
      });

      return matchedArticle || null;
    } catch (error) {
      console.error('Error finding article:', error);
      return null;
    }
  }

  /**
   * Universal article search across all sources
   */
  async getArticleByTitleUniversal(
    title: string,
    searchQuery?: string
  ): Promise<NewsArticle | null> {
    try {
      if (!title) {
        return null;
      }

      const { slugify } = await import('@/lib/utils/string');

      // Try search first if query provided
      if (searchQuery && searchQuery.trim().length > 0) {
        try {
          const searchResults = await this.searchArticles(searchQuery.trim(), {
            pageSize: 50,
            revalidate: 300,
          });

          const matchedArticle = searchResults.find((article) => {
            const apiTitleSlug = slugify(article.title);
            return apiTitleSlug === title;
          });

          if (matchedArticle) {
            return matchedArticle;
          }
        } catch (error) {
          console.warn('Search-based article lookup failed, trying categories');
        }
      }

      // Try all categories
      const categories = [
        'general',
        'business',
        'entertainment',
        'health',
        'science',
        'sports',
        'technology',
      ];

      for (const category of categories) {
        try {
          const article = await this.getArticleByTitle(category, title);
          if (article) {
            return article;
          }
        } catch (error) {
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error('Error in universal article search:', error);
      return null;
    }
  }

  /**
   * Fetches latest news with optimized field selection
   * Only fetches fields needed for news cards
   */
  async getLatestNews(pageSize: number = 20): Promise<NewsArticle[]> {
    try {
      const result = await queryTopHeadlines({
        country: 'us',
        pageSize,
        revalidate: 60,
        // Only fetch fields needed for news cards
        fields: [
          'title',
          'description',
          'url',
          'urlToImage',
          'publishedAt',
          'author',
          'source',
        ],
      });

      return result.articles as NewsArticle[];
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return [];
    }
  }
}

export const graphqlNewsService = new GraphQLNewsService();
