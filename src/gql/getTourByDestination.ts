import { gql } from "@apollo/client";

export const GET_TOUR_BY_DESTINATION = gql`
  query GetTourByDestination($language: String!, $destinationId: Int!) {
    toursListByDestination(language: $language, destinationId: $destinationId) {
      id
      slug
      name
      coverImage
      durationDays
      durationNights
      countries
      shortDescription
      minPrice
      difficulty
      fitnessLevel
    }
  }
`;
