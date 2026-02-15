import { gql } from "@apollo/client";

export const GET_TOUR_OPTION = gql`
  query GetTourOption($language: String!, $slug: String!) {
    tourOptions(language: $language, slug: $slug) {
      days
      options {
        id
        name
        description
        type
        minParticipants
        maxParticipants
        dateRanges {
          startDate
          endDate
          isActive
        }
        isActive
        meetingPoint {
          lat
          lng
          name
        }
        pickupArea {
          name
          bounds {
            north
            south
            east
            west
          }
          center {
            lat
            lng
          }
        }
        pricing {
          id
          mode
          basePrice
          ageCategories {
            price
            ageMin
            ageMax
            category
          }
          personRanges {
            price
            fromPerson
            toPerson
          }
          seasonalPricing {
            id
            startDate
            endDate
            modifier
            modifierType
          }
        }
      }
    }
  }
`;
