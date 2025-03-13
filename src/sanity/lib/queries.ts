// src/sanity/lib/queries.ts

import { groq } from "next-sanity";
import { client } from "./client";

// SEO field fragments
export const imageFields = groq`
  _type,
  crop{
    _type, 
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
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height
      }
    }
  }
`;

export const openGraphQuery = groq`
  _type,
  siteName,
  url,
  description,
  title,
  image{
    ${imageFields}
  }
`;

export const twitterQuery = groq`
  _type,
  site,
  creator,
  cardType,
  handle
`;

export const metaAttributesQuery = groq`
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage{
    ${imageFields}
  }
`;

export const seoFields = groq`
  _type,
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
    _type,
    metaAttributes[]{
      ${metaAttributesQuery}
    }
  }
`;

// Updated queries with SEO fields
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]{
    _id,
    _type,
    title,
    "slug": slug.current,
    mainImage,
    smallDescription,
    _updatedAt, 
    seo{
      ${seoFields}
    }
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    mainImage,
    smallDescription,
    _updatedAt, 
    body,
    seo{
      ${seoFields}
    }
  }
`;

export const postPathsQuery = groq`
  *[_type == "post" && defined(slug.current)][]{
    "params": { 
      "slug": slug.current 
    }
  }
`;

// Helper functions for fetching
export async function getPostWithSEO(slug: string) {
  return await client.fetch(postQuery, { slug });
}

export async function getAllPosts() {
  return await client.fetch(postsQuery);
}

export const guideQuery = groq`
  *[_type == "guide" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    subtitle,
    "slug": slug.current,
    introduction,
    sections,
    "coverImage": coverImage.asset->,
    calendarUrl,
    ctaText,
    consultationCta,
    "category": category->{
      title,
      "slug": slug.current
    },
    seo{
      ${seoFields}
    }
  }
`;

export const categoryGuidesQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    title,
    description,
    "guides": *[_type == "guide" && references(^._id)]{
      title,
      subtitle,
      "slug": slug.current,
      "coverImage": coverImage.asset->,
      seo{
        ${seoFields}
      }
    }
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"]{
    title,
    "slug": slug.current,
    description,
    "guideCount": count(*[_type == "guide" && references(^._id)])
  }
`;

export const guidesQuery = groq`
  *[_type == "guide" && defined(slug.current)]{
    _id,
    _type,
    title,
    subtitle,
    "slug": slug.current,
    "coverImage": coverImage.asset->,
    "category": category->{
      title,
      "slug": slug.current
    },
    seo{
      ${seoFields}
    }
  }
`;

export async function getGuides() {
  return await client.fetch(guidesQuery, {}, { next: { revalidate: 30 } });
}

export async function getGuideBySlug(slug: string) {
  return await client.fetch(guideQuery, { slug });
}
