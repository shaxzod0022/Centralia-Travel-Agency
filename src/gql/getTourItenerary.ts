import { gql } from "@apollo/client";

export const GET_TOUR_ITENERARY = gql`
  query GetTourItenerary($language: String!, $slug: String!) {
    tourItinerary(language: $language, slug: $slug) {
      id
      dayNumber
      title
      description
      whatToExpect
      meals
      transportation
      distanceMin
      distanceMax
      durationMin
      durationMax
      dayGallery
      accommodation {
        name
        type
        address
        starRating
        addressLink
        checkInTime
        checkOutTime
        photos
        rooms {
          name
          capacity
          quantity
        }
      }
    }
  }
`;
