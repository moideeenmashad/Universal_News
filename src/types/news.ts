export interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  author?: string;
  source?: {
    name: string;
  };
  content?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles: NewsArticle[];
  message?: string; // Error message when status is 'error'
  code?: string; // Error code when status is 'error'
}

export interface NewsDataArticle {
  article_id?: string;
  title: string;
  link?: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string;
  description?: string;
  content?: string;
  pubDate: string;
  image_url?: string;
  source_id?: string;
  source_priority?: number;
  source_url?: string;
  source_icon?: string;
  language?: string;
  country?: string[];
  category?: string[];
  ai_tag?: string;
  sentiment?: string;
  sentiment_stats?: string;
  ai_region?: string;
  ai_org?: string;
  duplicate?: boolean;
  next_page?: string;
}

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

