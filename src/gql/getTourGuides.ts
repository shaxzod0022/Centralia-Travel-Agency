import { gql } from "@apollo/client";

export const GET_TOURGUIDES = gql`
  query GetTourGuides($language: String!) {
    teamMembersByRole(
      roleId: "559c3209-5c1d-4960-9eb4-48cbc0e4f8a2"
      language: $language
    ) {
      name
      role {
        name
      }
      avatarUrl
      facebookUrl
      twitterUrl
      instagramUrl
      youtubeUrl
    }
  }
`;
