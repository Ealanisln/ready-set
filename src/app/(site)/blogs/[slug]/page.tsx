import { client, urlFor } from "@/sanity/lib/client";
import { FullPost } from "@/types/simple-blog-card";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
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

export default async function Page({ params }: { params: any }) {
  const data: FullPost = await getData(params.slug);
  console.log(JSON.stringify(data.body, null, 2));

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

            <div className="prose prose-xl prose-blue dark:prose-invert prose-li:marker:text-primary prose-a:text-primary mt-16"> <PortableText
              value={data.body}
            /></div>
          </div>
        </div>
      </div>
    </section>
  );
  // return <Post post={post} />;
}
