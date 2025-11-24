'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/graphql`, // URL GraphQL server
});

export const gqlClient = new ApolloClient({
  link: httpLink, // dùng link thay vì uri trực tiếp
  cache: new InMemoryCache(),
});
