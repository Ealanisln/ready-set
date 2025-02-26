import Breadcrumb from "@/components/Common/Breadcrumb";
import GuideGrid from "@/components/Resources/ResourcesGrid";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import { client } from "@/sanity/lib/client";
import { GuideCard } from "@/types/guide"; // We'll need to create this type

export async function generateStaticParams() {
  const guides = await client.fetch(`*[_type == "guide"].slug.current`);
  return guides.map((slug: string) => ({
    slug,
  }));
}

async function getData() {
  const query = `
  *[_type == "guide"] | order(_updatedAt desc) {
    _id,
    _updatedAt,
    title,
    subtitle,
    slug,
    coverImage,
    introduction,
    category->{
      title
    }
  }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function Guides() {
  const data: GuideCard[] = await getData();

  return (
    <>
      <Breadcrumb pageName="Resource Guides" />
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center sm:px-4">
            {/* <GuideGrid guides={data} basePath="guides" /> */}
            <div className="mt-20 w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}