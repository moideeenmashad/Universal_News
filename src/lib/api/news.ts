import {
  NEWS_API_BASE_URL,
  NEWS_DATA_API_BASE_URL,
  NEWS_API_KEY,
  NEWS_DATA_API_KEY,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY,
  CACHE_REVALIDATE_SHORT,
  CACHE_REVALIDATE_MEDIUM,
} from '@/constants/config';
import type { NewsApiResponse, NewsDataResponse, NewsArticle } from '@/types/news';
import { ApiError } from '../errors/ApiError';
import {
  saveToCache,
  loadFromCache,
  getHeadlinesCacheKey,
  getEverythingCacheKey,
  getLatestNewsCacheKey,
} from '../cache/newsCache';

class NewsService {
  private baseUrl = NEWS_API_BASE_URL;
  private newsDataUrl = NEWS_DATA_API_BASE_URL;

  /**
   * Check if we're running on the server (server actions) or client
   * Server actions can call external APIs directly (no CORS)
   * Client-side must use API route proxy
   */
  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  async getTopHeadlines(
    category?: string,
    country: string = DEFAULT_COUNTRY,
    pageSize: number = DEFAULT_PAGE_SIZE,
    revalidate: number = CACHE_REVALIDATE_SHORT
  ): Promise<NewsApiResponse> {
    const cacheKey = getHeadlinesCacheKey(category, country, pageSize);
    
    try {
      let url: string;
      
      // Server-side (server actions): call external API directly (no CORS issues)
      if (this.isServerSide()) {
        if (!NEWS_API_KEY) {
          // Try to load from cache if API key is missing
          const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
          if (cachedData) {
            console.log('Using cached data (API key missing)');
            return cachedData;
          }
          throw new ApiError('News API key is not configured', 401);
        }
        url = category
          ? `${this.baseUrl}/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
          : `${this.baseUrl}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
      } else {
        // Client-side: use API route proxy
        const params = new URLSearchParams({
          type: 'headlines',
          country,
          pageSize: String(pageSize),
        });
        if (category) params.set('category', category);
        url = `/api/news?${params.toString()}`;
      }

      const response = await fetch(url, {
        next: { revalidate }, // Next.js caching with revalidation
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Try to load from cache on error
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return cachedData;
        }
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(errorData.error || `HTTP error! status: ${response.status}`, response.status);
      }

      const data: NewsApiResponse = await response.json();

      if (data.status === 'error') {
        // Try to load from cache on API error
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API returned error, using cached data');
          return cachedData;
        }
        throw new ApiError(data.message || 'Failed to fetch headlines', 400);
      }

      // Save successful response to cache
      if (this.isServerSide()) {
        await saveToCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      // Try to load from cache on any error
      const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
      if (cachedData) {
        console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
        return cachedData;
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromFetchError(error);
    }
  }

  /**
   * Fetches all articles matching a query from NewsAPI with Next.js caching
   * @param query - Search query
   * @param pageSize - Number of articles to fetch (default: 20)
   * @param language - Language code (default: 'en' for English)
   * @param domains - Comma-separated list of domains to filter by (optional)
   * @param revalidate - Revalidation time in seconds (default: 60)
   * @returns Promise with news articles
   * @throws ApiError if request fails
   */
  async getEverything(
    query: string,
    pageSize: number = DEFAULT_PAGE_SIZE,
    language: string = DEFAULT_LANGUAGE,
    domains?: string,
    revalidate: number = CACHE_REVALIDATE_SHORT
  ): Promise<NewsApiResponse> {
    if (!query || query.trim().length === 0) {
      throw new ApiError('Search query cannot be empty', 400);
    }

    const cacheKey = getEverythingCacheKey(query.trim(), pageSize, domains);
    
    try {
      let url: string;
      
      // Server-side (server actions): call external API directly (no CORS issues)
      if (this.isServerSide()) {
        if (!NEWS_API_KEY) {
          // Try to load from cache if API key is missing
          const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
          if (cachedData) {
            console.log('Using cached data (API key missing)');
            return cachedData;
          }
          throw new ApiError('News API key is not configured', 401);
        }
        let baseUrl = `${this.baseUrl}/everything?q=${encodeURIComponent(query.trim())}&language=${language}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
        if (domains && domains.trim().length > 0) {
          baseUrl += `&domains=${encodeURIComponent(domains.trim())}`;
        }
        url = baseUrl;
      } else {
        // Client-side: use API route proxy
        const params = new URLSearchParams({
          type: 'everything',
          query: query.trim(),
          language,
          pageSize: String(pageSize),
        });
        if (domains && domains.trim().length > 0) {
          params.set('domains', domains.trim());
        }
        url = `/api/news?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        next: { revalidate }, // Next.js caching with revalidation
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Try to load from cache on error
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return cachedData;
        }
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(errorData.error || `HTTP error! status: ${response.status}`, response.status);
      }

      const data: NewsApiResponse = await response.json();

      if (data.status === 'error') {
        // Try to load from cache on API error
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API returned error, using cached data');
          return cachedData;
        }
        throw new ApiError(data.message || 'Failed to fetch articles', 400);
      }

      // Save successful response to cache
      if (this.isServerSide()) {
        await saveToCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      // Try to load from cache on any error
      const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
      if (cachedData) {
        console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
        return cachedData;
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromFetchError(error);
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

      // Shorter cache for suggestions (30 seconds)
      const response = await this.getEverything(query.trim(), limit, DEFAULT_LANGUAGE, undefined, 30);
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
   * Fetches latest news from NewsData.io API with Next.js caching
   * @param query - Search query (default: 'latest news')
   * @param language - Language code (default: 'en' for English)
   * @param revalidate - Revalidation time in seconds (default: 60)
   * @returns Promise with latest news articles
   * @throws ApiError if request fails
   */
  async getLatestNews(
    query: string = 'latest news',
    language: string = DEFAULT_LANGUAGE,
    revalidate: number = CACHE_REVALIDATE_SHORT
  ): Promise<NewsDataResponse> {
    const cacheKey = getLatestNewsCacheKey(query);
    
    try {
      let url: string;
      
      // Server-side (server actions): call external API directly (no CORS issues)
      if (this.isServerSide()) {
        if (!NEWS_DATA_API_KEY) {
          // Try to load from cache if API key is missing
          const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
          if (cachedData) {
            console.log('Using cached data (API key missing)');
            return cachedData;
          }
          throw new ApiError('NewsData API key is not configured', 401);
        }
        url = `${this.newsDataUrl}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(query)}&language=${language}`;
      } else {
        // Client-side: use API route proxy
        const params = new URLSearchParams({
          type: 'latest',
          query,
          language,
        });
        url = `/api/news?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        next: { revalidate }, // Next.js caching with revalidation
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Try to load from cache on error
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return cachedData;
        }
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(errorData.error || `HTTP error! status: ${response.status}`, response.status);
      }

      const data: NewsDataResponse = await response.json();

      if (data.status === 'error') {
        // Try to load from cache on API error
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API returned error, using cached data');
          return cachedData;
        }
        throw new ApiError('Failed to fetch latest news', 400);
      }

      // Save successful response to cache
      if (this.isServerSide()) {
        await saveToCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      // Try to load from cache on any error
      const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
      if (cachedData) {
        console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
        return cachedData;
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.fromFetchError(error);
    }
  }

  /**
   * Finds an article by its slugified title in a specific category
   * @param category - News category
   * @param title - Slugified article title
   * @param revalidate - Revalidation time in seconds (default: 300 for article details)
   * @returns Promise with matching article or null
   * @throws ApiError if request fails
   */
  async getArticleByTitle(
    category: string,
    title: string,
    revalidate: number = CACHE_REVALIDATE_MEDIUM
  ): Promise<NewsArticle | null> {
    try {
      if (!category || !title) {
        return null;
      }

      const response = await this.getTopHeadlines(category, 'us', 20, revalidate);
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
      throw ApiError.fromFetchError(error);
    }
  }

  /**
   * Finds an article by its slugified title across all sources (search + categories)
   * This is used for articles from search results that might not be in category headlines
   * @param title - Slugified article title
   * @param searchQuery - Optional search query to narrow down results
   * @param revalidate - Revalidation time in seconds (default: 300 for article details)
   * @returns Promise with matching article or null
   * @throws ApiError if request fails
   */
  async getArticleByTitleUniversal(
    title: string,
    searchQuery?: string,
    revalidate: number = CACHE_REVALIDATE_MEDIUM
  ): Promise<NewsArticle | null> {
    try {
      if (!title) {
        return null;
      }

      const { slugify } = await import('@/lib/utils/string');
      const titleSlug = slugify(title);

      // First, try general headlines (no category) - this catches most hero section articles
      // This should be first since hero sections use useTopHeadlines(undefined, 'us', 20)
      try {
        const generalResponse = await this.getTopHeadlines(undefined, 'us', 100, revalidate);
        const matchedArticle = generalResponse.articles.find((article: NewsArticle) => {
          const apiTitleSlug = slugify(article.title);
          return apiTitleSlug === titleSlug;
        });

        if (matchedArticle) {
          return matchedArticle;
        }
      } catch (error) {
        console.warn('General headlines search failed');
      }

      // Try NewsData.io latest news if available
      if (NEWS_DATA_API_KEY) {
        try {
          const latestNewsResponse = await this.getLatestNews('latest news', DEFAULT_LANGUAGE, revalidate);
          if (latestNewsResponse?.results) {
            // Transform NewsDataArticle to NewsArticle format
            const matchedArticle = latestNewsResponse.results.find((item) => {
              const apiTitleSlug = slugify(item.title);
              return apiTitleSlug === titleSlug;
            });

            if (matchedArticle) {
              // Convert NewsDataArticle to NewsArticle format
              return {
                title: matchedArticle.title,
                description: matchedArticle.description,
                url: matchedArticle.link || '#',
                urlToImage: matchedArticle.image_url,
                publishedAt: matchedArticle.pubDate,
                author: matchedArticle.creator?.[0] || matchedArticle.source_name,
                source: {
                  name: matchedArticle.source_name || 'Unknown',
                },
                content: matchedArticle.content,
              };
            }
          }
        } catch (error) {
          // If NewsData.io search fails, continue to other searches
          console.warn('NewsData.io latest news search failed, trying other sources');
        }
      }

      // Try search query if provided
      if (searchQuery && searchQuery.trim().length > 0) {
        try {
          const searchResponse = await this.getEverything(searchQuery.trim(), 100, DEFAULT_LANGUAGE, undefined, revalidate);
          const matchedArticle = searchResponse.articles.find((article: NewsArticle) => {
            const apiTitleSlug = slugify(article.title);
            return apiTitleSlug === titleSlug;
          });

          if (matchedArticle) {
            return matchedArticle;
          }
        } catch (error) {
          // If search fails, continue to category search
          console.warn('Search-based article lookup failed, trying categories');
        }
      }


      // Try all categories with more articles
      const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
      
      for (const category of categories) {
        try {
          const response = await this.getTopHeadlines(category, 'us', 100, revalidate);
          const matchedArticle = response.articles.find((article: NewsArticle) => {
            const apiTitleSlug = slugify(article.title);
            return apiTitleSlug === titleSlug;
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
