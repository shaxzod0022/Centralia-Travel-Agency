import { gql } from "@apollo/client";

export const GET_TOUR_GENERAL = gql`
  query GetTourGeneral($language: String!, $slug: String!) {
    tourGeneral(language: $language, slug: $slug) {
      name
      shortDescription
      longDescription
      highlights
      tourMapLink
      faqs {
        question
        answer
      }
      countries {
        id
        name
      }
      destinations {
        id
        name
      }
      difficulty
      duration {
        days
        nights
      }
      ageRange {
        min
        max
      }
      fitnessLevel
      coverImage
      gallery
    }
  }
`;
