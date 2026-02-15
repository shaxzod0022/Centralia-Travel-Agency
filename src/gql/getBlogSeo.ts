import { gql } from "@apollo/client";

export const GET_BLOG_SEO = gql`
  query GetBlogSeo($language: String!, $slug: String!) {
    blogSEO(language: $language, slug: $slug) {
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
