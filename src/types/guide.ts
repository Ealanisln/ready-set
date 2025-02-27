// src/types/guide.ts
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import type { Image, Slug } from "sanity";

export interface ListItem {
  _key: string;
  title?: string;
  content: string;
}

export interface ListSection {
  _key: string;
  title: string;
  items: ListItem[];
}

export interface MainContentSection {
  _key: string;
  title: string;
  content: PortableTextBlock[];
}

export interface Category {
  _id: string;
  title: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: Image;
    siteName?: string;
    url?: string;
  };
  twitter?: {
    cardType?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
  };
}

export interface GuideDocument {
  _id: string;
  _type: "guide";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  subtitle: string;
  slug: Slug;
  introduction: PortableTextBlock[];
  mainContent?: MainContentSection[];
  listSections?: ListSection[];
  callToAction?: string;
  coverImage: Image;
  calendarUrl: string;
  downloadUrl: string;
  ctaText?: string;
  consultationCta?: string;
  category?: Category;
  seo?: SeoFields;
}

// For the card preview in the grid
export interface GuideCard {
  _id: string;
  title: string;
  subtitle: string;
  slug: Slug;
  coverImage: Image;
  introduction?: any[]; // For portable text
  category?: {
    title: string;
  };
}

// Props for the ResourceGuide component
export interface ResourceGuideProps
  extends Omit<
    GuideDocument,
    "_type" | "_id" | "_createdAt" | "_updatedAt" | "slug"
  > {
  portableTextComponents?: PortableTextComponents;
}
