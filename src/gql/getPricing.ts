import { gql } from "@apollo/client";

export const GET_TOUR_PRICING = gql`
  query GetTourPricing($language: String!, $slug: String!) {
    tourPricing(language: $language, slug: $slug) {
      optionId
      optionName
      pricingMode
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
    }
  }
`;
