export const NEWS_DATA_API_BASE_URL = 'https://newsdata.io/api/1';

export const NEWS_DATA_API_KEY = process.env.NEXT_PUBLIC_NEWS_DATA_API_KEY || '';

export const DEFAULT_COUNTRY = 'us';
export const DEFAULT_LANGUAGE = 'en'; // English only
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_QUERY = 'worldnews';

// Next.js cache revalidation times (in seconds)
export const CACHE_REVALIDATE_SHORT = 60; // 1 minute for frequently changing data
export const CACHE_REVALIDATE_MEDIUM = 300; // 5 minutes for article details
export const CACHE_REVALIDATE_LONG = 3600; // 1 hour for static content
