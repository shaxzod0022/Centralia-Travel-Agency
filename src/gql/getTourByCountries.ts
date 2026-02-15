import { gql } from "@apollo/client";

export const GET_TOUR_BY_COUNTRY = gql`
  query GetTourByCountry($language: String!, $countryId: Int!) {
    toursListByCountry(language: $language, countryId: $countryId) {
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
