// src/app/(site)/free/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import ResourceGuide from "@/components/Resources/ResourceGuide";
import type { PortableTextComponents } from "@portabletext/react";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";

export const revalidate = 30;

const guideQuery = `*[_type == "guide" && slug.current == $slug][0] {
  title,
  subtitle,
  introduction,
  mainContent,
  listSections,
  callToAction,
  coverImage,
  calendarUrl,
  downloadUrl,
  ctaText,
  consultationCta,
  category->{
    title
  },
  seo,
  _updatedAt
}`;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getGuide(slug: string) {
  if (!slug) return null;

  try {
    return await client.fetch(guideQuery, { slug });
  } catch (error) {
    console.error("Error fetching guide:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  const { title, coverImage, seo } = guide;

  const ogImage = seo?.openGraph?.image
    ? urlForImage(seo.openGraph.image)
    : coverImage
      ? urlForImage(coverImage)
      : undefined;

  return {
    title: seo?.metaTitle ?? `${title} | Ready Set LLC`,
    description: seo?.metaDescription ?? title,
    openGraph: {
      title: seo?.openGraph?.title ?? title,
      description: seo?.openGraph?.description ?? seo?.metaDescription ?? title,
      images: ogImage ? [{ url: ogImage }] : undefined,
      siteName: seo?.openGraph?.siteName ?? "Ready Set LLC",
      url: seo?.openGraph?.url,
    },
    twitter: seo?.twitter
      ? {
          card: seo.twitter.cardType as
            | "summary"
            | "summary_large_image"
            | "app"
            | "player",
          site: seo.twitter.site,
          creator: seo.twitter.creator,
        }
      : undefined,
    keywords: seo?.seoKeywords?.join(", "),
  };
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <Image
        src={urlForImage(value).toString()}
        alt={value.alt || "Guide Image"}
        className="mt-8 rounded-xl"
        width={800}
        height={600}
      />
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-8 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-8 list-decimal space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-4">{children}</li>,
    number: ({ children }) => <li className="mb-4">{children}</li>,
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-8 whitespace-pre-line">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="mb-6 text-4xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 text-3xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 text-2xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-4 text-xl font-bold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-8 border-l-4 border-primary pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) {
        return <>{children}</>;
      }

      const isExternal = value.href.startsWith("http");

      return (
        <a
          href={value.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline transition-colors hover:text-primary/80"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <ResourceGuide
              {...guide}
              portableTextComponents={portableTextComponents}
            />
          </div>
        </div>
        <div className="pt-16">
          <NewsletterForm />
        </div>
      </div>
    </article>
  );
}
