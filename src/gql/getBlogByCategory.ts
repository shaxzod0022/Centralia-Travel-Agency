import { gql } from "@apollo/client";

export const GET_BLOGBYCATEGORY = gql`
  query GetBlogByCategory($language: String!, $categoryId: Int!) {
    blogs(limit: 6, language: $language, categoryId: $categoryId) {
      title
      content
      slug
      featuredImage
      readTime
      viewsCount
      authorName
      categories {
        id
        name
      }
      publishedAt
    }
  }
`;
