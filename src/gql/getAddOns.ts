import { gql } from "@apollo/client";

export const GET_AD_ONS = gql`
  query GetAdOns($slug: String!, $language: String!) {
    tourAddOns(slug: $slug, language: $language) {
      id
      name
      description
      chargeType
      price
      currency
      isActive
    }
  }
`;
