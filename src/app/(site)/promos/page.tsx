import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

// Export with dynamic data fetching to avoid static generation problems
export const dynamic = 'force-dynamic';

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Ready Set | Always ready for you",
  description: "Information about our promos",
};

async function getData() {
  try {
    // Import client only when needed
    const { client } = await import("@/sanity/lib/client");
    
    const query = `
    *[_type == 'post' && 'Promos' in categories[]->title] {
      _id,
      _updatedAt,
      title,
      slug,
      mainImage,
      smallDescription,
      categories[]->{ title }
    }  
    `;
    
    const data = await client.fetch(query);
    return data;
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
