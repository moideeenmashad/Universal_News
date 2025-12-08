import axios, { AxiosError } from 'axios';
import {
  NEWS_API_BASE_URL,
  NEWS_DATA_API_BASE_URL,
  NEWS_API_KEY,
  NEWS_DATA_API_KEY,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY,
} from '@/constants/config';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';

class NewsService {
  private baseUrl = NEWS_API_BASE_URL;
  private newsDataUrl = NEWS_DATA_API_BASE_URL;

  /**
   * Fetches top headlines from NewsAPI
   * @param category - News category (optional)
   * @param country - Country code (default: 'us')
   * @param pageSize - Number of articles to fetch (default: 20)
   * @returns Promise with news articles
   * @throws ApiError if request fails
   */
  async getTopHeadlines(
    category?: string,
    country: string = DEFAULT_COUNTRY,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<NewsApiResponse> {
    try {
      if (!NEWS_API_KEY) {
        throw new ApiError('News API key is not configured', 401);
      }

      const url = category
        ? `${this.baseUrl}/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
        : `${this.baseUrl}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

      const response = await axios.get<NewsApiResponse>(url, {
        timeout: 10000, // 10 second timeout
      });

      if (response.data.status === 'error') {
        throw new ApiError(response.data.message || 'Failed to fetch headlines', 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromAxiosError(error);
    }
  }

  /**
   * Fetches all articles matching a query from NewsAPI
   * @param query - Search query
   * @param pageSize - Number of articles to fetch (default: 20)
   * @param language - Language code (default: 'en' for English)
   * @returns Promise with news articles
   * @throws ApiError if request fails
   */
  async getEverything(
    query: string,
    pageSize: number = DEFAULT_PAGE_SIZE,
    language: string = DEFAULT_LANGUAGE
  ): Promise<NewsApiResponse> {
    try {
      if (!NEWS_API_KEY) {
        throw new ApiError('News API key is not configured', 401);
      }

      if (!query || query.trim().length === 0) {
        throw new ApiError('Search query cannot be empty', 400);
      }

      const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query.trim())}&language=${language}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
      const response = await axios.get<NewsApiResponse>(url, {
        timeout: 10000,
      });

      if (response.data.status === 'error') {
        throw new ApiError(response.data.message || 'Failed to fetch articles', 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromAxiosError(error);
    }
  }

  /**
   * Fetches search suggestions based on query (returns limited results for autocomplete)
   * @param query - Search query
   * @param limit - Maximum number of suggestions (default: 5)
   * @returns Promise with suggested articles
   * @throws ApiError if request fails
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<NewsArticle[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const response = await this.getEverything(query.trim(), limit, DEFAULT_LANGUAGE);
      return response.articles || [];
    } catch (error) {
      // Don't throw error for suggestions, just return empty array
      if (error instanceof ApiError && error.statusCode === 429) {
        // Rate limit - return empty to avoid more calls
        return [];
      }
      return [];
    }
  }

  /**
   * Fetches latest news from NewsData.io API
   * @param query - Search query (default: 'worldnews')
   * @param language - Language code (default: 'en' for English)
   * @returns Promise with latest news articles
   * @throws ApiError if request fails
   */
  async getLatestNews(
    query: string = DEFAULT_QUERY,
    language: string = DEFAULT_LANGUAGE
  ): Promise<NewsDataResponse> {
    try {
      if (!NEWS_DATA_API_KEY) {
        throw new ApiError('NewsData API key is not configured', 401);
      }

      const url = `${this.newsDataUrl}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(query)}&language=${language}`;
      const response = await axios.get<NewsDataResponse>(url, {
        timeout: 10000,
      });

      if (response.data.status === 'error') {
        throw new ApiError('Failed to fetch latest news', 400);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromAxiosError(error);
    }
  }

  /**
   * Finds an article by its slugified title in a specific category
   * @param category - News category
   * @param title - Slugified article title
   * @returns Promise with matching article or null
   * @throws ApiError if request fails
   */
  async getArticleByTitle(category: string, title: string): Promise<NewsArticle | null> {
    try {
      if (!category || !title) {
        return null;
      }

      const response = await this.getTopHeadlines(category);
      const { slugify } = await import('@/lib/utils/string');

      const matchedArticle = response.articles.find((article: NewsArticle) => {
        const apiTitleSlug = slugify(article.title);
        return apiTitleSlug === title;
      });

      return matchedArticle || null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromAxiosError(error);
    }
  }

  /**
   * Finds an article by its slugified title across all sources (search + categories)
   * This is used for articles from search results that might not be in category headlines
   * @param title - Slugified article title
   * @param searchQuery - Optional search query to narrow down results
   * @returns Promise with matching article or null
   * @throws ApiError if request fails
   */
  async getArticleByTitleUniversal(title: string, searchQuery?: string): Promise<NewsArticle | null> {
    try {
      if (!title) {
        return null;
      }

      const { slugify } = await import('@/lib/utils/string');

      // First, try to find in search results if query provided
      if (searchQuery && searchQuery.trim().length > 0) {
        try {
          const searchResponse = await this.getEverything(searchQuery.trim(), 50, DEFAULT_LANGUAGE);
          const matchedArticle = searchResponse.articles.find((article: NewsArticle) => {
            const apiTitleSlug = slugify(article.title);
            return apiTitleSlug === title;
          });

          if (matchedArticle) {
            return matchedArticle;
          }
        } catch (error) {
          // If search fails, continue to category search
          console.warn('Search-based article lookup failed, trying categories');
        }
      }

      // Try all categories
      const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
      
      for (const category of categories) {
        try {
          const response = await this.getTopHeadlines(category, 'us', 20);
          const matchedArticle = response.articles.find((article: NewsArticle) => {
            const apiTitleSlug = slugify(article.title);
            return apiTitleSlug === title;
          });

          if (matchedArticle) {
            return matchedArticle;
          }
        } catch (error) {
          // Continue to next category if one fails
          continue;
        }
      }

      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Error in universal article search:', error);
      return null;
    }
  }
}

export const newsService = new NewsService();
