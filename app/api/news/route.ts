import { NextRequest, NextResponse } from 'next/server';
import {
  NEWS_DATA_API_BASE_URL,
  NEWS_DATA_API_KEY,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE_SIZE,
} from '@/shared/constants/config';
import {
  loadFromCache,
  getHeadlinesCacheKey,
  getEverythingCacheKey,
  getLatestNewsCacheKey,
} from '@/shared/lib/cache/newsCache';
import type { NewsApiResponse, NewsDataResponse } from '@/shared/types';

/**
 * API Route to proxy news API requests
 * This solves the CORS issue with NewsAPI.org free tier
 */
export async function GET(request: NextRequest) {
  // Declare variables outside try block so they're accessible in catch
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'headlines', 'everything', 'latest'
  let cacheKey = '';
  
  try {
     // Validate type parameter early
     if (!type || !['headlines', 'everything', 'latest'].includes(type)) {
       return NextResponse.json(
         { 
           status: 'error',
           totalResults: 0,
           articles: [],
           message: 'Invalid or missing type parameter. Use: headlines, everything, or latest' 
         },
         { status: 200 }
       );
     }
    
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const country = searchParams.get('country') || DEFAULT_COUNTRY;
    const pageSize = searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE);
    const language = searchParams.get('language') || DEFAULT_LANGUAGE;
    const domains = searchParams.get('domains'); // Comma-separated list of domains

    // Generate cache key based on type
    try {
      if (type === 'headlines') {
        cacheKey = getHeadlinesCacheKey(category || undefined, country, Number(pageSize));
      } else if (type === 'everything') {
        cacheKey = getEverythingCacheKey(query || '', Number(pageSize), domains || undefined);
      } else if (type === 'latest') {
        cacheKey = getLatestNewsCacheKey(query || 'latest news');
      }
    } catch (keyError) {
      console.error('Error generating cache key:', keyError);
      // Continue without cache key
    }

    // If API keys are missing, try to load from cache first
    if (!NEWS_DATA_API_KEY && (type === 'headlines' || type === 'everything' || type === 'latest')) {
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API key missing, using cached data');
          return NextResponse.json(cachedData);
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API key missing, using cached data');
          return NextResponse.json(cachedData);
        }
      }
      return NextResponse.json(
        { 
          status: 'error',
          totalResults: 0,
          articles: type === 'latest' ? undefined : [],
          results: type === 'latest' ? [] : undefined,
          message: 'NewsData API key is not configured and no cached data available' 
        },
        { status: 200 }
      );
    }

    let url = '';

    if (type === 'headlines') {
      // Use NewsData.io /latest endpoint with category as query
      if (!NEWS_DATA_API_KEY) {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API key missing, using cached data');
          return NextResponse.json(cachedData);
        }
        return NextResponse.json(
          { 
            status: 'error',
            totalResults: 0,
            articles: [],
            message: 'NewsData API key is not configured and no cached data available' 
          },
          { status: 200 }
        );
      }
      
      // Use category as query parameter for /latest endpoint
      const queryParam = category || 'news';
      url = `${NEWS_DATA_API_BASE_URL}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(queryParam)}&language=${language}`;
     } else if (type === 'everything') {
       if (!query) {
         return NextResponse.json(
           { 
             status: 'error',
             totalResults: 0,
             articles: [],
             message: 'Query parameter is required for everything endpoint' 
           },
           { status: 200 }
         );
       }
      // Use NewsData.io /news endpoint with query
      url = `${NEWS_DATA_API_BASE_URL}/news?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(query)}&language=${language}`;
    } else if (type === 'latest') {
      const searchQuery = query || 'latest news';
      url = `${NEWS_DATA_API_BASE_URL}/latest?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(searchQuery)}&language=${language}`;
    }

    // Add timeout to fetch request (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(url, {
        // Use Next.js caching for external API calls
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Universal-News/1.0',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Handle timeout or network errors
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('API request timeout');
      } else {
        console.error('API fetch error:', fetchError);
      }
      
      // Try to load from cache on network error
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('Network error, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('Network error, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      }
      
      // Return error response with 200 status to prevent 500 errors
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
        message: 'Network error. Please try again later.',
      }, { status: 200 });
    }

    if (!response.ok) {
      // Try to load from cache on API error
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('API failed, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      }
      
      // Return error response with 200 status to prevent 500 errors
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error:', response.status, errorText);
      
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
        message: `API request failed: ${response.status}`,
      }, { status: 200 });
    }

    let data: NewsDataResponse;
    try {
      data = await response.json() as NewsDataResponse;
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      // Try to load from cache on JSON parse error
      if (type === 'headlines' || type === 'everything') {
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('JSON parse error, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      } else if (type === 'latest') {
        const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
        if (cachedData) {
          console.log('JSON parse error, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
      }
      
      // Return error response with 200 status
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
        message: 'Failed to parse API response',
      }, { status: 200 });
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
      
      // Return error response with 200 status to prevent 500 errors
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
        message: 'API returned an error',
      }, { status: 200 });
    }

    // Convert NewsDataResponse to NewsApiResponse for headlines and everything
    if (type === 'headlines' || type === 'everything') {
      try {
        const convertedData: NewsApiResponse = {
          status: data.status,
          totalResults: data.totalResults || 0,
          articles: (data.results || []).map(item => ({
            title: item.title || 'Untitled',
            description: item.description,
            url: item.link || '#',
            urlToImage: item.image_url,
            publishedAt: item.pubDate || new Date().toISOString(),
            author: item.creator?.[0] || item.source_name,
            source: {
              name: item.source_name || 'Unknown',
            },
            content: item.content,
            article_id: item.article_id,
          })),
        };
        
        // Limit to pageSize if specified
        const pageSizeNum = Number(pageSize);
        if (convertedData.articles.length > pageSizeNum) {
          convertedData.articles = convertedData.articles.slice(0, pageSizeNum);
          convertedData.totalResults = pageSizeNum;
        }
        
        return NextResponse.json(convertedData);
      } catch (conversionError) {
        console.error('Data conversion error:', conversionError);
        // Try to load from cache on conversion error
        const cachedData = await loadFromCache<NewsApiResponse>(cacheKey);
        if (cachedData) {
          console.log('Conversion error, using cached data');
          return NextResponse.json(cachedData, { status: 200 });
        }
        
        // Return error response with 200 status
        return NextResponse.json({
          status: 'error',
          totalResults: 0,
          articles: [],
          message: 'Failed to process API response',
        }, { status: 200 });
      }
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
            return NextResponse.json(cachedData, { status: 200 });
          }
        } else if (type === 'latest') {
          const cachedData = await loadFromCache<NewsDataResponse>(cacheKey);
          if (cachedData) {
            console.log('Error occurred, using cached data:', error instanceof Error ? error.message : 'Unknown error');
            return NextResponse.json(cachedData, { status: 200 });
          }
        }
      } catch (cacheError) {
        console.error('Cache load error:', cacheError);
        // Continue to return empty response even if cache fails
      }
    }
    
    // Always return 200 status with empty data instead of 500 error to prevent breaking the app
    // This ensures the frontend can handle the error gracefully
    try {
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
    } catch (responseError) {
      // Last resort: if even creating the response fails, return minimal JSON
      console.error('Failed to create error response:', responseError);
      return new NextResponse(
        JSON.stringify({ status: 'error', totalResults: 0, articles: [] }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}

