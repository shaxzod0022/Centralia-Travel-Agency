import { gql } from "@apollo/client";

export const GET_EVENTSBYSLUG = gql`
  query GetEventsBySlug($slug: String!, $language: String!) {
    eventGeneral(slug: $slug, language: $language) {
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
