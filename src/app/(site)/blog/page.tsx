// app/blog/page.tsx
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { postsQuery, getAllPosts } from "@/sanity/lib/queries";

// Export with dynamic data fetching to avoid static generation problems
export const dynamic = 'force-dynamic';

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Business Blog For Efficiency and Growth | Ready Set LLC",
  description:
    "Explore our blog for practical advice on business efficiency, operational excellence, and sustainable growth strategies for small to mid-sized companies.",
  keywords: [
    "logistics blog",
    "virtual assistant insights",
    "Bay Area business",
    "catering delivery tips",
    "business solutions",
    "industry updates",
    "logistics expertise",
    "VA services blog",
    "business efficiency",
    "delivery insights",
    "professional tips",
    "Silicon Valley logistics",
    "business management",
    "service excellence",
    "industry best practices",
  ],
  openGraph: {
    title: "Business Blog For Efficiency and Growth | Ready Set LLC",
    description:
      "Explore our blog for practical advice on business efficiency, operational excellence, and sustainable growth strategies for small to mid-sized companies.",
    url: "https://readyset.consulting/blog",
    siteName: "Ready Set",
    images: [
      {
        url: "https://readyset.consulting/images/blog-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Blog For Efficiency and Growth | Ready Set LLC",
    description:
      "Explore our blog for practical advice on business efficiency, operational excellence, and sustainable growth strategies for small to mid-sized companies.",
    images: ["https://readyset.consulting/images/blog-og.jpg"],
  },
  alternates: {
    canonical: "https://readyset.consulting/blog",
  },
};

async function getData() {
  return await getAllPosts();
}

export default async function Blog() {
  const data = await getData();

  return (
    <>
      {/* Hidden SEO content */}
      <div className="sr-only" role="complementary" aria-label="Blog Overview">
        <h1>Ready Set Group LLC Blog - Industry Insights & Expertise</h1>
        <p>
          Welcome to the Ready Set Blog, your source for expert insights on
          logistics, virtual assistant services, and business solutions in the
          Bay Area. Our team of industry professionals shares valuable
          knowledge, tips, and best practices to help your business thrive.
        </p>

        <div role="navigation" aria-label="Blog Categories">
          <h2>Expert Knowledge Base</h2>
          <div>
            <h3>Logistics Insights</h3>
            <ul>
              <li>Catering delivery best practices</li>
              <li>Temperature-controlled transportation</li>
              <li>Efficient route optimization</li>
              <li>Food safety protocols</li>
              <li>Last-mile delivery solutions</li>
              <li>Quality control measures</li>
            </ul>
          </div>

          <div>
            <h3>Virtual Assistant Excellence</h3>
            <ul>
              <li>Remote work efficiency tips</li>
              <li>Business process optimization</li>
              <li>Administrative task management</li>
              <li>Professional communication</li>
              <li>Time management strategies</li>
              <li>Productivity enhancement</li>
            </ul>
          </div>
        </div>

        <div role="contentinfo" aria-label="Industry Expertise">
          <h2>Industry Leadership</h2>
          <p>
            Our blog showcases insights from experienced professionals who have
            served Silicon Valley&apos;s leading companies. Learn from
            real-world experiences and stay updated with the latest trends in
            business solutions.
          </p>

          <h3>Featured Topics</h3>
          <ul>
            <li>Business efficiency strategies</li>
            <li>Technology integration tips</li>
            <li>Customer service excellence</li>
            <li>Industry best practices</li>
            <li>Professional development</li>
            <li>Service innovation</li>
            <li>Market trends and analysis</li>
            <li>Success stories and case studies</li>
          </ul>
        </div>
      </div>

      {/* Visual content */}
      <Breadcrumb pageName="Welcome to our blog" />
      
      <section className="pb-[120px] pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center justify-between">
            <div className="mb-8 w-full px-4 md:mb-0 lg:mb-0">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[40px]">
                  Our Blog
                </h1>
                <p className="text-base text-body-color dark:text-dark-5">
                  Insights, resources, and practical advice to optimize your
                  business operations and drive sustainable growth in today's
                  competitive market.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full">
              <SingleBlog data={data} basePath="blog" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
