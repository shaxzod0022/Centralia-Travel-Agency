import { gql } from "@apollo/client";

export const GET_NEWS_SEO = gql`
  query GetNewsSeo($language: String!, $slug: String!) {
    newsSEO(language: $language, slug: $slug) {
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
