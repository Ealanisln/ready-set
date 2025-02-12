// src/components/Blog/CustomSeo.tsx
'use client';

import React from "react";
import Head from "next/head";
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

  return (
    <Head>
      {metaTitle && <title>{metaTitle}</title>}
      {metaDescription && <meta name="description" content={metaDescription} />}
      <link rel="canonical" href={url} />
      
      {/* OpenGraph tags */}
      {openGraph?.title && <meta property="og:title" content={openGraph.title} />}
      {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
      {openGraph?.siteName && <meta property="og:site_name" content={openGraph.siteName} />}
      {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
      {openGraph?.image?.asset?.url && <meta property="og:image" content={openGraph.image.asset.url} />}
      
      {/* Twitter tags */}
      {twitter?.cardType && <meta name="twitter:card" content={twitter.cardType} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      
      {/* Robots meta */}
      {nofollowAttributes && (
        <meta 
          name="robots" 
          content={`${nofollowAttributes ? 'nofollow,noindex' : 'follow,index'}`} 
        />
      )}
      
      {/* Keywords */}
      {seoKeywords && seoKeywords.length > 0 && (
        <meta name="keywords" content={seoKeywords.join(", ")} />
      )}
    </Head>
  );
};

export default CustomNextSeo;