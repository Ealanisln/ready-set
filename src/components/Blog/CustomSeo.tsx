// app/components/CustomNextSeo.tsx
import React, { useMemo } from "react";
import { NextSeo } from "next-seo";
import type {
  MetaTag as NextSeoMetaTag,
  OpenGraph as NextSeoOpenGraph,
} from "next-seo/lib/types";
import type {
  CustomImageType,
  MetaAttributeType,
  MetaTagType,
  OpenGraphType,
  SeoType,
} from "@/sanity/schemaTypes/seo";

type ValidHttpEquiv =
  | "content-security-policy"
  | "content-type"
  | "default-style"
  | "x-ua-compatible"
  | "refresh";

const isValidHttpEquiv = (value: string): value is ValidHttpEquiv => {
  const validValues = [
    "content-security-policy",
    "content-type",
    "default-style",
    "x-ua-compatible",
    "refresh",
  ];
  return validValues.includes(value);
};

// Helper functions for processing SEO data
const resolveImage = (image?: CustomImageType): string => {
  return image?.asset?.url ?? "";
};

const getMetaAttribute = (
  attrs: MetaAttributeType[] | undefined,
): NextSeoMetaTag | null => {
  if (!attrs) return null;

  // Find name/content pair
  const nameAttr = attrs.find((attr) => attr.attributeKey === "name");
  const contentAttr = attrs.find((attr) => attr.attributeKey === "content");

  if (nameAttr?.attributeValueString && contentAttr) {
    return {
      name: nameAttr.attributeValueString,
      content:
        contentAttr.attributeType === "image"
          ? resolveImage(contentAttr.attributeValueImage)
          : (contentAttr.attributeValueString ?? ""),
    };
  }

  // Find property/content pair (for Open Graph)
  const propertyAttr = attrs.find((attr) => attr.attributeKey === "property");
  if (propertyAttr?.attributeValueString && contentAttr) {
    return {
      property: propertyAttr.attributeValueString,
      content:
        contentAttr.attributeType === "image"
          ? resolveImage(contentAttr.attributeValueImage)
          : (contentAttr.attributeValueString ?? ""),
    };
  }

  // Find httpEquiv/content pair
  const httpEquivAttr = attrs.find((attr) => attr.attributeKey === "httpEquiv");
  if (httpEquivAttr?.attributeValueString && contentAttr) {
    const httpEquivValue = httpEquivAttr.attributeValueString;

    // Only create httpEquiv meta tag if it's a valid value
    if (isValidHttpEquiv(httpEquivValue)) {
      return {
        httpEquiv: httpEquivValue,
        content:
          contentAttr.attributeType === "image"
            ? resolveImage(contentAttr.attributeValueImage)
            : (contentAttr.attributeValueString ?? ""),
      };
    }
  }

  return null;
};

const getMetaObjects = (
  tags: MetaTagType[],
  allowIndexing = true,
): NextSeoMetaTag[] => {
  return tags.reduce((acc: NextSeoMetaTag[], tag) => {
    const hasNoIndexNoFollow = tag.metaAttributes?.some(
      (attr) =>
        attr.attributeValueString?.includes("noindex") ||
        attr.attributeValueString?.includes("nofollow"),
    );

    if (!allowIndexing && hasNoIndexNoFollow) {
      return acc;
    }

    const metaTag = getMetaAttribute(tag.metaAttributes);
    if (metaTag) {
      acc.push(metaTag);
    }
    return acc;
  }, []);
};
const getOpenGraph = (args: OpenGraphType): NextSeoOpenGraph => {
  const { description, image, title, siteName, url } = args;
  const imageUrl = resolveImage(image);

  return {
    description,
    siteName,
    url,
    title,
    images: imageUrl ? [{ url: imageUrl }] : undefined,
  };
};

interface CustomNextSeoProps {
  seo: SeoType | null;
  slug: string;
  children?: React.ReactNode;
}

const CustomNextSeo: React.FC<CustomNextSeoProps> = ({
  seo,
  slug,
  children,
}) => {
  const {
    additionalMetaTags,
    metaDescription,
    metaTitle,
    twitter,
    nofollowAttributes,
    seoKeywords,
  } = seo ?? {};

  // Memoize expensive computations
  const metaTags = useMemo(
    () => (additionalMetaTags ? getMetaObjects(additionalMetaTags) : []),
    [additionalMetaTags],
  );

  const openGraph = useMemo(
    () => (seo?.openGraph ? getOpenGraph(seo.openGraph) : undefined),
    [seo?.openGraph],
  );

  // Construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const url = `${baseUrl}${normalizedSlug}`;

  // Combine keywords with other meta tags
  const allMetaTags = useMemo(() => {
    const keywordsTags: NextSeoMetaTag[] = seoKeywords?.length
      ? [{ name: "keywords", content: seoKeywords.join(", ") }]
      : [];
    return [...keywordsTags, ...metaTags];
  }, [seoKeywords, metaTags]);

  return (
    <>
      <NextSeo
        title={metaTitle ?? ""}
        description={metaDescription ?? ""}
        canonical={url}
        openGraph={openGraph}
        nofollow={nofollowAttributes}
        noindex={nofollowAttributes}
        twitter={{
          handle: twitter?.creator,
          site: twitter?.site,
          cardType: twitter?.cardType,
        }}
        additionalMetaTags={allMetaTags}
      />
      {children}
    </>
  );
};

export default CustomNextSeo;
