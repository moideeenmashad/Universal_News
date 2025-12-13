import { NextRequest, NextResponse } from 'next/server';
import {
  NEWS_API_BASE_URL,
  NEWS_DATA_API_BASE_URL,
  NEWS_API_KEY,
  NEWS_DATA_API_KEY,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE_SIZE,
} from '@/constants/config';
import {
  loadFromCache,
  getHeadlinesCacheKey,
  getEverythingCacheKey,
  getLatestNewsCacheKey,
} from '@/lib/cache/newsCache';
import type { NewsApiResponse, NewsDataResponse } from '@/types/news';

/**
 * API Route to proxy news API requests
 * This solves the CORS issue with NewsAPI.org free tier
 */
export async function GET(request: NextRequest) {
  // Declare variables outside try block so they're accessible in catch
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'headlines', 'everything', 'latest'
  const category = searchParams.get('category');
  const query = searchParams.get('query');
  const country = searchParams.get('country') || DEFAULT_COUNTRY;
  const pageSize = searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE);
  const language = searchParams.get('language') || DEFAULT_LANGUAGE;
  const domains = searchParams.get('domains'); // Comma-separated list of domains

  // Generate cache key based on type
  let cacheKey = '';
  if (type === 'headlines') {
    cacheKey = getHeadlinesCacheKey(category || undefined, country, Number(pageSize));
  } else if (type === 'everything') {
    cacheKey = getEverythingCacheKey(query || '', Number(pageSize), domains || undefined);
  } else if (type === 'latest') {
    cacheKey = getLatestNewsCacheKey(query || 'latest news');
  }

  try {

    // If API keys are missing, try to load from cache first
    if (!NEWS_API_KEY && (type === 'headlines' || type === 'everything')) {
      const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
      if (cachedData) {
        console.log('API key missing, using cached data');
        return NextResponse.json(cachedData);
      }
      return NextResponse.json(
        { error: 'News API key is not configured and no cached data available' },
        { status: 500 }
      );
    }

    if (!NEWS_DATA_API_KEY && type === 'latest') {
      const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
      if (cachedData) {
        console.log('API key missing, using cached data');
        return NextResponse.json(cachedData);
      }
      return NextResponse.json(
        { error: 'NewsData API key is not configured and no cached data available' },
        { status: 500 }
      );
    }

    let url = '';

    if (type === 'headlines') {
      url = category
        ? `${NEWS_API_BASE_URL}/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
        : `${NEWS_API_BASE_URL}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    } else if (type === 'everything') {
      if (!query) {
        return NextResponse.json(
          { error: 'Query parameter is required for everything endpoint' },
          { status: 400 }
        );
      }
      let everythingUrl = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
      if (domains && domains.trim().length > 0) {
        everythingUrl += `&domains=${encodeURIComponent(domains.trim())}`;
      }
      url = everythingUrl;
    } else if (type === 'latest') {
      const searchQuery = query || 'latest news';
      url = `${NEWS_DATA_API_BASE_URL}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(searchQuery)}&language=${language}`;
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use: headlines, everything, or latest' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      // Use Next.js caching for external API calls
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Universal-News/1.0',
      },
    });

    if (!response.ok) {
      // Try to load from cache on API error
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return NextResponse.json(cachedData);
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return NextResponse.json(cachedData);
        }
      }
      
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    let data: NewsApiResponse | NewsDataResponse;
    
    if (type === 'latest') {
      data = await response.json() as NewsDataResponse;
    } else {
      data = await response.json() as NewsApiResponse;
    }

    if (data.status === 'error') {
      // Try to load from cache on API error response
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API returned error, using cached data');
          return NextResponse.json(cachedData);
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API returned error, using cached data');
          return NextResponse.json(cachedData);
        }
      }
      
      // Handle error message - NewsApiResponse has message, NewsDataResponse doesn't
      const errorMessage = type === 'latest' 
        ? 'API returned an error'
        : (data as NewsApiResponse).message || 'API returned an error';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Try to load from cache on any error
    if (cacheKey) {
      try {
        if (type === 'headlines' || type === 'everything') {
          const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
          if (cachedData) {
            console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
            return NextResponse.json(cachedData);
          }
        } else if (type === 'latest') {
          const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
          if (cachedData) {
            console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
            return NextResponse.json(cachedData);
          }
        }
      } catch (cacheError) {
        console.error('Cache load error:', cacheError);
      }
    }
    
    // Return empty response instead of 500 error to prevent breaking the app
    if (type === 'latest') {
      return NextResponse.json({
        status: 'error',
        totalResults: 0,
        results: [],
      }, { status: 200 });
    }
    
    return NextResponse.json({
      status: 'error',
      totalResults: 0,
      articles: [],
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 200 });
  }
}

