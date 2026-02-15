import { gql } from "@apollo/client";

export const GET_EVENTS_SEO = gql`
  query GetEventsSeo($language: String!, $slug: String!) {
    eventSEO(language: $language, slug: $slug) {
      metaTitle
      metaDescription
      metaKeywords
      slug
      ogTitle
      ogDescription
      ogImage
      twitterTitle
      twitterDescription
      twitterImage
      canonicalUrl
      focusKeyphrase
      featuredSnippet
      structuredData
    }
  }
`;
