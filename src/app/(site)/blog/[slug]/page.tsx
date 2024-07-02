import { client, urlFor } from "@/sanity/lib/client";
import { FullPost } from "@/types/simple-blog-card";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";

export const revalidate = 30; // revalidate at most every hour

async function getData(slug: string) {
  const query = `
    *[_type == "post" && slug.current == '${slug}'] {
      "currentSlug": slug.current,
      title,
      body,
      mainImage,
      code   
    }[0]`;

  const data = await client.fetch(query);

  return data;
}

// Define custom components for Portable Text
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <img
          src={urlFor(value).url()}
          alt={value.alt || "Blog Image"}
          className="mt-8 rounded-xl"
        />
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="ml-8 list-disc">{children}</ul>,
    number: ({ children }) => <ol className="ml-8 list-decimal">{children}</ol>,
  },
  block: {
    normal: ({ children }) => (
      <p style={{ whiteSpace: 'pre-line', marginBottom: '2em' }}>{children}</p>
    ),
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const target = value.href.startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-primary underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function Page({ params }: { params: any }) {
  const data: FullPost = await getData(params.slug);

  if (!data) {
    notFound();
  }

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <h1>
              <span className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {data.title}
              </span>
            </h1>

            <Image
              src={urlFor(data.mainImage).url()}
              width={800}
              height={800}
              alt={data.title}
              priority
              className="mt-8 rounded-xl"
            />

            <div className="prose prose-xl prose-blue dark:prose-invert prose-li:marker:text-primary prose-a:text-primary mt-16" style={{ whiteSpace: 'pre-line' }}>
              <PortableText
                value={data.body}
                components={components}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
