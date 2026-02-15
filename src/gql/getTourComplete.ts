import { gql } from "@apollo/client";

export const TOUR_COMPLETE_QUERY = gql`
  query TourComplete($slug: String!, $language: String) {
    tourComplete(slug: $slug, language: $language) {
      id
      slug
      name
      coverImage
      durationDays
      durationNights
      countries {
        id
        name
        code
      }
      categories {
        id
        name
      }
      shortDescription
      minPrice
      technicalLevel
      fitnessLevel
      longDescription
      highlights
      destinations {
        id
        name
      }
      ageRange {
        min
        max
      }
      gallery
      tourMapLink
      faqs {
        id
        question
        answer
        displayOrder
      }
      tourItinerary {
        id
        dayNumber
        title
        description
        whatToExpect
        meals
        transportation
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
        dayGallery
        distanceMin
        distanceMax
        durationMin
        durationMax
      }
      tourIncluded
      tourExcluded
    }
  }
`;
