import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents($language: String!) {
    events(limit: 20, language: $language) {
      id
      slug
      featuredImage
      readTime
      viewsCount
      title
      content
      publishedAt
    }
  }
`;
