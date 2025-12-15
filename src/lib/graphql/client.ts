import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const defaultEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://newsapi.org/v2';

export const graphqlClient = new ApolloClient({
  link: new HttpLink({ uri: defaultEndpoint }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

