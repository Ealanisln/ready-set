// app/blog/page.tsx
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { client } from "@/sanity/lib/client";
import { postPathsQuery } from "@/sanity/lib/queries";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Ready Set Blog | Insights on Logistics & Virtual Assistant Services",
  description: "Expert insights on catering delivery logistics, virtual assistant services, and business solutions in the Bay Area. Stay updated with industry trends, tips, and best practices from Ready Set Group LLC.",
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
    "industry best practices"
  ],
  openGraph: {
    title: "Ready Set Blog | Business Insights & Industry Expertise",
    description: "Discover expert insights on logistics, virtual assistant services, and business solutions. Learn from Bay Area&apos;s leading business solutions provider.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready Set Blog | Business Solutions Insights",
    description: "Expert articles on logistics, virtual assistant services, and business solutions from Ready Set Group LLC.",
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

async function getData() {
  const query = `
  *[_type == 'post' && (!defined(categories) || !('Promos' in categories[]->title))] {
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
}

export default async function Blog() {
  const data: SimpleBlogCard[] = await getData();

  return (
    <>
      {/* Hidden SEO content */}
      <div className="sr-only" role="complementary" aria-label="Blog Overview">
        <h1>Ready Set Group LLC Blog - Industry Insights & Expertise</h1>
        <p>Welcome to the Ready Set Blog, your source for expert insights on logistics, virtual assistant services, and business solutions in the Bay Area. Our team of industry professionals shares valuable knowledge, tips, and best practices to help your business thrive.</p>
        
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
          <p>Our blog showcases insights from experienced professionals who have served Silicon Valley&apos;s leading companies. Learn from real-world experiences and stay updated with the latest trends in business solutions.</p>
          
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

      {/* Existing visual content */}
      <Breadcrumb pageName="Welcome to our blog" />
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center sm:px-4">
            <SingleBlog data={data} basePath="blog" />
          </div>
        </div>
      </section>
    </>
  );
}