// src/app/(site)/blog/[slug]/page.tsx
import { client, urlFor } from "@/sanity/lib/client";
import { postQuery } from "@/sanity/lib/queries";
import type {
  PortableTextMarkComponentProps,
  PortableTextComponents,
} from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import CustomNextSeo from "@/components/Blog/CustomSeo";
import type { PostDocument } from "@/sanity/schemaTypes/seo";
import React from "react";
import { format } from "date-fns";
import BookNow from "@/components/Blog/BookNow";

export const revalidate = 30;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getPost(slug: string): Promise<PostDocument | null> {
  if (!slug) return null;

  try {
    return await client.fetch(postQuery, { slug });
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { title, mainImage, seo } = post;

  const ogImage = seo?.openGraph?.image
    ? urlFor(seo.openGraph.image).url()
    : mainImage
      ? urlFor(mainImage).url()
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
        src={urlFor(value).url()}
        alt={value.alt || "Blog Image"}
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
    link: ({
      children,
      value,
    }: PortableTextMarkComponentProps<{
      _type: string;
      href: string;
    }>) => {
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

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { title, mainImage, body, seo, _updatedAt } = post;
  const seoSlug = `/blog/${slug}`;

  const formattedDate = format(new Date(_updatedAt), "MMMM d, yyyy");

  return (
    <article className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <h1 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
              {title}
            </h1>
            <div className="mb-8 text-base text-gray-600 dark:text-gray-400">
              {formattedDate}
            </div>

            {mainImage && (
              <Image
                src={urlFor(mainImage).url()}
                width={800}
                height={800}
                alt={title}
                priority
                className="mt-8 rounded-xl"
              />
            )}

            {body && (
              <div className="prose prose-xl prose-blue dark:prose-invert prose-li:marker:text-primary prose-a:text-primary mt-16">
                <PortableText
                  value={body}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <BookNow title={""} subtitle={""} ctaText={""} ctaLink={""} />
    </article>
  );
}
