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
  article_id?: string; // For NewsData.io deduplication
}

export interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles: NewsArticle[];
  message?: string; // Error message when status is 'error'
  code?: string; // Error code when status is 'error'
}
