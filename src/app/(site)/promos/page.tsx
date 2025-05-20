import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { getPosts } from "@/sanity/lib/client";
import { SimpleBlogCard } from "@/types/simple-blog-card";

// Export with dynamic data fetching to avoid static generation problems
export const dynamic = 'force-dynamic';

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Ready Set | Always ready for you",
  description: "Information about our promos",
};

async function getData(): Promise<SimpleBlogCard[]> {
  try {
    // Get posts from our mock client
    return await getPosts();
  } catch (error) {
    console.error("Error fetching promos:", error);
    return []; // Return empty array as fallback
  }
}

export default async function Blog() {
  const data = await getData();

  return (
    <>
      <Breadcrumb pageName="Welcome to our Promos blog" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center sm:px-4">
          <SingleBlog data={data} basePath="promos" />
          </div>
        </div>
      </section>
    </>
  );
}
