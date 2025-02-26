// src/app/(site)/free-resources/[slug]/page.tsx

import { notFound } from "next/navigation";
import BackArrow from "@/components/Common/Back";
import { getGuideBySlug } from "@/sanity/lib/queries";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";

// Define TypeScript types for Sanity data
type PortableTextBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: any[];
};

type SanityImage = {
  _type: string;
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
};

type Section = {
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
};

type SEO = {
  _type: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  nofollowAttributes?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
  twitter?: {
    site?: string;
    creator?: string;
    cardType?: string;
    handle?: string;
  };
};

type Guide = {
  _id: string;
  _type: string;
  title: string;
  subtitle?: string;
  slug: string;
  introduction?: PortableTextBlock[] | string;
  sections?: Section[];
  coverImage?: {
    _id: string;
    url: string;
  };
  calendarUrl?: string;
  ctaText?: string;
  consultationCta?: string;
  category?: {
    title: string;
    slug: string;
  };
  seo?: SEO;
};

// Define params as a Promise to match the Next.js behavior
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ResourcePage({ params }: PageProps) {
  // Await the params promise to get the slug
  const resolvedParams = await params;
  const guide: Guide | null = await getGuideBySlug(resolvedParams.slug);

  if (!guide) notFound();

  return (
    <div className="min-h-screen py-12 pt-36">
      <div className="container mx-auto px-4">
        <div className="prose max-w-none">
          <h1>{guide.title}</h1>
          {guide.subtitle && <p className="text-xl">{guide.subtitle}</p>}
          
          {guide.coverImage && (
            <div className="my-6">
              <Image 
                src={guide.coverImage.url} 
                alt={guide.title}
                width={800}
                height={400}
                className="rounded-lg"
              />
            </div>
          )}
          
          {/* Introduction section */}
          {guide.introduction && (
            <div className="my-8">
              {typeof guide.introduction === 'string' ? (
                <p>{guide.introduction}</p>
              ) : (
                <PortableText value={guide.introduction} />
              )}
            </div>
          )}
          
          {/* Render sections if they exist */}
          {guide.sections && guide.sections.length > 0 && (
            <div className="my-8">
              {guide.sections.map((section) => (
                <div key={section._key} className="mb-8">
                  {section.title && <h2>{section.title}</h2>}
                  {section.content && <PortableText value={section.content} />}
                </div>
              ))}
            </div>
          )}
          
          {/* Display CTA if it exists */}
          {guide.ctaText && (
            <div className="my-8 rounded-lg bg-blue-50 p-6">
              <p className="text-lg font-medium">{guide.ctaText}</p>
              {guide.calendarUrl && (
                <a 
                  href={guide.calendarUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {guide.consultationCta || "Schedule a Consultation"}
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <BackArrow />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params promise to get the slug
  const resolvedParams = await params;
  const guide: Guide | null = await getGuideBySlug(resolvedParams.slug);
  
  if (!guide) {
    return {
      title: 'Resource Not Found',
    };
  }

  return {
    title: guide.seo?.metaTitle || guide.title,
    description: guide.seo?.metaDescription || guide.subtitle,
  };
}