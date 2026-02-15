import { gql } from "@apollo/client";

export const GET_NEWSBYSLUG = gql`
  query GetNewsBySlug($slug: String!, $language: String!) {
    newsGeneral(slug: $slug, language: $language) {
      title
      content
      slug
      featuredImage
      readTime
      viewsCount
      publishedAt
    }
  }
`;
