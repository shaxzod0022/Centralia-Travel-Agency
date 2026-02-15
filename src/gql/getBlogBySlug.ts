import { gql } from "@apollo/client";

export const GET_BLOGBYSLUG = gql`
  query GetBlogBySlug($slug: String!, $language: String!) {
    blogGeneral(slug: $slug, language: $language) {
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
