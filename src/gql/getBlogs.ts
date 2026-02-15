import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs($language: String!) {
    blogs(limit: 10, language: $language) {
      slug
      featuredImage
      readTime
      viewsCount
      title
      content
      categories {
        id
        name
      }
      publishedAt
    }
  }
`;
