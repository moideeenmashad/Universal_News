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

/**
 * API Route to proxy news API requests
 * This solves the CORS issue with NewsAPI.org free tier
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'headlines', 'everything', 'latest'
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const country = searchParams.get('country') || DEFAULT_COUNTRY;
    const pageSize = searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE);
    const language = searchParams.get('language') || DEFAULT_LANGUAGE;

    if (!NEWS_API_KEY && (type === 'headlines' || type === 'everything')) {
      return NextResponse.json(
        { error: 'News API key is not configured' },
        { status: 500 }
      );
    }

    if (!NEWS_DATA_API_KEY && type === 'latest') {
      return NextResponse.json(
        { error: 'NewsData API key is not configured' },
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
      url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    } else if (type === 'latest') {
      const searchQuery = query || 'worldnews';
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
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status === 'error') {
      return NextResponse.json(
        { error: data.message || 'API returned an error' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

