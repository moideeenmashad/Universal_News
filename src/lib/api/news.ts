import axios, { AxiosError } from 'axios';
import {
  NEWS_API_BASE_URL,
  NEWS_DATA_API_BASE_URL,
  NEWS_API_KEY,
  NEWS_DATA_API_KEY,
  DEFAULT_COUNTRY,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY,
} from '@/src/constants/config';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/src/types/news';
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
   * @returns Promise with news articles
   * @throws ApiError if request fails
   */
  async getEverything(query: string, pageSize: number = DEFAULT_PAGE_SIZE): Promise<NewsApiResponse> {
    try {
      if (!NEWS_API_KEY) {
        throw new ApiError('News API key is not configured', 401);
      }

      if (!query || query.trim().length === 0) {
        throw new ApiError('Search query cannot be empty', 400);
      }

      const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query.trim())}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
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
   * Fetches latest news from NewsData.io API
   * @param query - Search query (default: 'worldnews')
   * @returns Promise with latest news articles
   * @throws ApiError if request fails
   */
  async getLatestNews(query: string = DEFAULT_QUERY): Promise<NewsDataResponse> {
    try {
      if (!NEWS_DATA_API_KEY) {
        throw new ApiError('NewsData API key is not configured', 401);
      }

      const url = `${this.newsDataUrl}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(query)}`;
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
   * Finds an article by its slugified title
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
      const { slugify } = await import('@/src/lib/utils/string');

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
}

export const newsService = new NewsService();
