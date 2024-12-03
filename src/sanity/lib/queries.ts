// ./nextjs-app/sanity/lib/queries.ts
import { groq } from "next-sanity";
import { client } from "./client";

// SEO field fragments
export const imageFields = groq`
  type,
  crop{
    type, 
    right, 
    top, 
    left, 
    bottom
  },
  hotspot{
    _type,
    x,
    y,
    height,
    width
  },
  asset->
`;

export const openGraphQuery = groq`
  type,
  siteName,
  url,
  description,
  title,
  image{
    ${imageFields}
  }
`;

export const twitterQuery = groq`
  type,
  site,
  creator,
  cardType,
  handle
`;

export const metaAttributesQuery = groq`
  type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage{
    ${imageFields}
  }
`;

export const seoFields = groq`
  type,
  metaTitle,
  nofollowAttributes,
  seoKeywords,
  metaDescription,
  openGraph{
    ${openGraphQuery}
  },
  twitter{
    ${twitterQuery}
  },
  additionalMetaTags[]{
    type,
    metaAttributes[]{
      ${metaAttributesQuery}
    }
  }
`;

// Updated queries with SEO fields
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]{
    _id,
    title,
    slug,
    mainImage,
    seo{
      ${seoFields}
    }
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    title,
    mainImage,
    body,
    seo{
      ${seoFields}
    }
  }
`;

// The paths query can remain the same since it's just for generating routes
export const postPathsQuery = groq`
  *[_type == "post" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }
`;

// Example usage in your page component
export const getPostWithSEO = async (slug: string) => {
  return await client.fetch(postQuery, { slug });
};
