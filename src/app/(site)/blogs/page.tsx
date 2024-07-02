import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { client } from "@/sanity/lib/client";
import { postPathsQuery } from "@/sanity/lib/queries";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Ready Set | Always ready for you",
  description: "Information about our services",
};

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  // Important, use the plain Sanity Client here
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

async function getData() {
  const query = `
  *[_type == 'post'] {
    _id,
    _updatedAt,
    title,
    slug,
    mainImage,
    smallDescription,
  }  
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function Blog() {
  const data: SimpleBlogCard[] = await getData();

  console.log(data);

  return (
    <>
      <Breadcrumb pageName="Welcome to our blog" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center sm:px-4">
              <SingleBlog data={data} />
          </div>
        </div>
      </section>
    </>
  );
}
