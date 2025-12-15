import type { NewsArticle, NewsArticleField } from '@/types/news';
import { queryEverything, querySearchSuggestions, queryTopHeadlines } from '../graphql/newsQueries';

interface GraphQLBaseOptions {
  fields?: NewsArticleField[];
  revalidate?: number;
}

interface GraphQLHeadlinesOptions extends GraphQLBaseOptions {
  country?: string;
  pageSize?: number;
}

interface GraphQLEverythingOptions extends GraphQLBaseOptions {
  pageSize?: number;
  language?: string;
  domains?: string;
}

class GraphqlNewsService {
  async getTopHeadlines(
    category?: string,
    { country = 'us', pageSize = 20, fields, revalidate }: GraphQLHeadlinesOptions = {}
  ): Promise<NewsArticle[]> {
    const response = await queryTopHeadlines({ category, country, pageSize, fields, revalidate });
    return response.articles;
  }

  async searchArticles(
    query: string,
    { pageSize = 20, language = 'en', domains, fields, revalidate }: GraphQLEverythingOptions = {}
  ): Promise<NewsArticle[]> {
    const response = await queryEverything({ query, pageSize, language, domains, fields, revalidate });
    return response.articles;
  }

  async getSearchSuggestions(
    query: string,
    limit: number = 5,
    fields?: NewsArticleField[]
  ): Promise<NewsArticle[]> {
    return querySearchSuggestions(query, limit, fields);
  }
}

export const graphqlNewsService = new GraphqlNewsService();

