// lib/apolloClient.ts
// ISR-enabled Apollo clients with 1-hour revalidation
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Default revalidation time: 1 hour (3600 seconds)
const DEFAULT_REVALIDATE = 3600;

export const mainClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URI}/api/v1/graphql`,
    fetchOptions: { next: { revalidate: DEFAULT_REVALIDATE, tags: ["tours", "categories", "destinations"] } },
  }),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export const teamMembersClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URI}/api/v1/graphql/team-members`,
    fetchOptions: { next: { revalidate: DEFAULT_REVALIDATE, tags: ["team-members"] } },
  }),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export const blogsClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URI}/api/v1/graphql/blogs`,
    fetchOptions: { next: { revalidate: DEFAULT_REVALIDATE, tags: ["blogs"] } },
  }),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export const newsClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URI}/api/v1/graphql/news`,
    fetchOptions: { next: { revalidate: 1800, tags: ["news"] } }, // 30 min for news
  }),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export const eventsClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URI}/api/v1/graphql/event`,
    fetchOptions: { next: { revalidate: 1800, tags: ["events"] } }, // 30 min for events
  }),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});
