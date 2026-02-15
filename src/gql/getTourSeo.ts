// gql/getTourSeo.ts
import { gql } from '@apollo/client';

export const GET_TOUR_SEO = gql`
  query GetTourSEO($slug: String!, $language: String!) {
    tourSEO(slug: $slug, language: $language) {
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