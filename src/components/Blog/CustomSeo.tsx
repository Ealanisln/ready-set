// src/components/Blog/CustomSeo.tsx
'use client';

import React from "react";
import { NextSeo } from "next-seo";
import type { SeoType } from "@/sanity/schemaTypes/seo";

interface CustomNextSeoProps {
  seo: SeoType | null;
  slug: string;
}

const CustomNextSeo: React.FC<CustomNextSeoProps> = ({ seo, slug }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const url = `${baseUrl}${normalizedSlug}`;

  const {
    metaTitle,
    metaDescription,
    openGraph,
    twitter,
    nofollowAttributes,
    seoKeywords,
  } = seo ?? {};

  // Serialize openGraph data
  const serializedOpenGraph = openGraph ? {
    title: openGraph.title,
    description: openGraph.description,
    siteName: openGraph.siteName,
    url: openGraph.url,
    images: openGraph.image?.asset?.url 
      ? [{ url: openGraph.image.asset.url }] 
      : undefined,
  } : undefined;

  // Serialize twitter data
  const serializedTwitter = twitter ? {
    handle: twitter.creator,
    site: twitter.site,
    cardType: twitter.cardType,
  } : undefined;

  return (
    <NextSeo
      title={metaTitle ?? ""}
      description={metaDescription ?? ""}
      canonical={url}
      openGraph={serializedOpenGraph}
      nofollow={nofollowAttributes}
      noindex={nofollowAttributes}
      twitter={serializedTwitter}
      additionalMetaTags={seoKeywords?.length 
        ? [{ name: "keywords", content: seoKeywords.join(", ") }]
        : undefined}
    />
  );
};

export default CustomNextSeo;