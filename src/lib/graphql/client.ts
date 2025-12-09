import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

// GraphQL endpoint - using a public news GraphQL API
// We'll use NewsAPI.org's REST API but wrap it with GraphQL-like queries
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://newsapi.org/v2';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

// GraphQL Queries for News
export const GET_TOP_HEADLINES = gql`
  query GetTopHeadlines($category: String, $country: String, $pageSize: Int) {
    topHeadlines(category: $category, country: $country, pageSize: $pageSize) {
      status
      totalResults
      articles {
        source {
          id
          name
        }
        author
        title
        description
        url
        urlToImage
        publishedAt
        content
      }
    }
  }
`;

export const GET_EVERYTHING = gql`
  query GetEverything($query: String!, $language: String, $pageSize: Int) {
    everything(query: $query, language: $language, pageSize: $pageSize) {
      status
      totalResults
      articles {
        source {
          id
          name
        }
        author
        title
        description
        url
        urlToImage
        publishedAt
        content
      }
    }
  }
`;

export const SEARCH_ARTICLES = gql`
  query SearchArticles($query: String!, $limit: Int) {
    search(query: $query, limit: $limit) {
      source {
        id
        name
      }
      author
      title
      description
      url
      urlToImage
      publishedAt
    }
  }
`;
