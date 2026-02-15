import { gql } from "@apollo/client";

export const GET_TOUR_INCLUDED = gql`
  query GetTourIncluded($language: String!, $slug: String!) {
    tourIncluded(language: $language, slug: $slug)
  }
`;
