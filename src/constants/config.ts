export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
export const NEWS_DATA_API_BASE_URL = 'https://newsdata.io/api/1';

export const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || '';
export const NEWS_DATA_API_KEY = process.env.NEXT_PUBLIC_NEWS_DATA_API_KEY || '';

export const DEFAULT_COUNTRY = 'us';
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_QUERY = 'worldnews';

export const QUERY_STALE_TIME = 60 * 1000; // 1 minute
export const QUERY_GC_TIME = 5 * 60 * 1000; // 5 minutes

