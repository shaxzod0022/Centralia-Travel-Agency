import { gql } from "@apollo/client";

export const GET_BLOGS4 = gql`
  query GetBlogs4($language: String!) {
    latestBlogs(language: $language) {
      slug
      featuredImage
      readTime
      viewsCount
      title
      content
      categories {
        name
      }
      publishedAt
    }
  }
`;
