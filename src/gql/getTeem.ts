import { gql } from "@apollo/client";

export const GET_TEEM = gql`
  query GetTeems($language: String!) {
    teamMembers(language: $language) {
      id
      name
      role {
        id
        name
      }
      roleId
      avatarUrl
      facebookUrl
      twitterUrl
      instagramUrl
      youtubeUrl
      createdAt
      updatedAt
    }
  }
`;
