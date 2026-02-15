import { gql } from "@apollo/client";

export const GET_NEWS = gql`
  query GetNews($language: String!) {
    news(limit: 20, language: $language) {
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
