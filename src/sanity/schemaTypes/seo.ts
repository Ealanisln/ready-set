// /lib/sanity/types/seo.ts
import type { SanityAsset, SanityImageCrop, SanityImageHotspot } from '@sanity/image-url/lib/types/types'

// Custom asset type extending SanityAsset
export interface CustomSanityAsset extends SanityAsset {
  metadata?: {
    _type?: "sanityImageMetadata"
    dimensions?: {
      _type?: "sanityImageDimensions"
      height?: number
      width?: number
    }
  }
}

export interface CustomImageType {
  _type: "customImage"
  asset?: CustomSanityAsset
  crop?: SanityImageCrop
  hotspot?: SanityImageHotspot
}

// SEO-specific types
export interface MetaAttributeType {
  _type: "metaAttribute"
  attributeKey?: string
  attributeType?: string
  attributeValueString?: string
  attributeValueImage?: CustomImageType
}

export interface MetaTagType {
  _type: "metaTag"
  metaAttributes?: MetaAttributeType[]
}

export interface OpenGraphType {
  _type: "openGraph"
  title: string
  url?: string
  siteName?: string
  description: string
  image: CustomImageType
}

export interface TwitterType {
  _type: "twitter"
  handle?: string
  creator?: string
  site?: string
  cardType?: string
}

export interface SeoType {
  _type: "seo"
  nofollowAttributes?: boolean
  metaDescription?: string
  additionalMetaTags?: MetaTagType[]
  metaTitle?: string
  seoKeywords?: string[]
  openGraph?: OpenGraphType
  twitter?: TwitterType
}

// Example document type
export interface PostDocument {
  _type: "post"
  _id: string
  title: string
  slug: {
    current: string
  }
  seo?: SeoType
}