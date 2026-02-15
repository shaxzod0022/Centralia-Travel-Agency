import { gql } from "@apollo/client";

export const GET_TOUR_EXCLUDED = gql`
  query GetTourExcluded($language: String!, $slug: String!) {
    tourExcluded(language: $language, slug: $slug)
  }
`;
