// src/app/(site)/free-resources/[slug]/page.tsx
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanity/lib/client";
import BackArrow from "@/components/Common/Back";
import React from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import type { Metadata } from "next";
export const revalidate = 30;

// Define types for Portable Text blocks
interface PortableTextSpan {
  _key?: string;
  _type: string;
  marks?: string[];
  text: string;
}

interface PortableTextBlock {
  _key?: string;
  _type: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: any[];
}

// Updated query to match the new schema structure
const guideQuery = `*[_type == "guide" && slug.current == $slug][0]{
  title,
  subtitle,
  introduction,
  coverImage,
  mainContent,
  listSections,
  conclusion,
  callToAction,
  calendarUrl,
  consultationCta,
  _updatedAt,
  seo,
  "category": category->title,
  downloadableFiles[] {
    _key,
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`;

interface GuideDocument {
  title: string;
  subtitle?: string;
  introduction?: PortableTextBlock[];
  coverImage?: any;
  mainContent?: Array<{
    title: string;
    content: PortableTextBlock[];
  }>;
  listSections?: Array<{
    title: string;
    items: Array<{
      title?: string;
      content: string;
    }>;
  }>;
  conclusion?: PortableTextBlock[];
  callToAction?: string;
  calendarUrl?: string;
  consultationCta?: string;
  _updatedAt: string;
  category?: string;
  downloadableFiles?: Array<{
    _key: string;
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
    }
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraph?: {
      title?: string;
      description?: string;
      image?: any;
      siteName?: string;
      url?: string;
    };
  };
}

async function getGuide(slug: string): Promise<GuideDocument | null> {
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
  
  const { title, seo } = guide;
  const ogImage = seo?.openGraph?.image
    ? urlFor(seo.openGraph.image).url()
    : guide.coverImage
      ? urlFor(guide.coverImage).url()
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
    }
  };
}

// Helper function to render portable text blocks
const renderPortableText = (blocks: PortableTextBlock[] | undefined): string => {
  if (!blocks || !Array.isArray(blocks)) return "";
  
  return blocks.map(block => {
    if (!block.children) return "";
    return block.children.map((child: PortableTextSpan) => child.text || "").join("");
  }).join("<br/>");
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  
  if (!guide) notFound();
  
  // Get the image URL from coverImage
  const imageUrl = guide.coverImage ? urlFor(guide.coverImage).url() : 
    "https://placehold.co/600x400/FCD34D/333333?text=Guide";
  
  // Create downloadable files section if files exist
  const hasDownloadableFiles = guide.downloadableFiles && guide.downloadableFiles.length > 0;
  
  // Function to handle multiple file types with appropriate icons
  const getFileIcon = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📑';
      case 'zip':
        return '🗜️';
      default:
        return '📄';
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Main content section */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Content */}
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-800">
                  {guide.title}
                </h1>
                <h2 className="text-xl text-gray-600">
                  {guide.subtitle || "A Business Owner's Guide"}
                </h2>
                
                {/* Introduction */}
                {guide.introduction && (
                  <div className="text-gray-600">
                    <div dangerouslySetInnerHTML={{ 
                      __html: renderPortableText(guide.introduction)
                    }} />
                  </div>
                )}
                
                {/* Main Content Sections */}
                {guide.mainContent && guide.mainContent.length > 0 && (
                  <div className="space-y-6 mt-8">
                    {guide.mainContent.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {section.title}
                        </h2>
                        {section.content && (
                          <div className="text-gray-600">
                            <div dangerouslySetInnerHTML={{ 
                              __html: renderPortableText(section.content)
                            }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* List Sections */}
                {guide.listSections && guide.listSections.length > 0 && (
                  <div className="space-y-6 mt-8">
                    {guide.listSections.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {section.title}
                        </h2>
                        {section.items && section.items.length > 0 && (
                          <ul className="space-y-2 text-gray-600 list-disc pl-5">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.title ? (
                                  <>
                                    <span className="font-bold">{item.title}:</span> {item.content}
                                  </>
                                ) : (
                                  item.content
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Conclusion */}
                {guide.conclusion && (
                  <div className="space-y-3 mt-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Conclusion
                    </h2>
                    <div className="text-gray-600">
                      <div dangerouslySetInnerHTML={{ 
                        __html: renderPortableText(guide.conclusion)
                      }} />
                    </div>
                  </div>
                )}
                
                {/* Downloadable Files Section */}
                {hasDownloadableFiles && (
                  <div className="space-y-4 mt-8" id="download">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Downloadable Resources
                    </h2>
                    <div className="space-y-3">
                      {guide.downloadableFiles?.map((file) => (
                        <div key={file._key} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="mr-4 text-2xl">
                            {getFileIcon(file.asset.originalFilename)}
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{file.asset.originalFilename}</p>
                          </div>
                          <a 
                            href={file.asset.url}
                            download={file.asset.originalFilename}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Call to action */}
                {guide.callToAction && (
                  <div className="space-y-4 mt-8">
                    <p className="text-gray-700 font-medium">
                      {guide.callToAction}
                    </p>
                    <p className="text-gray-600">
                      If you found this guide helpful, share it with your network or
                      schedule a consultation call with us. Ready to take the next
                      step? Contact{" "}
                      <a 
                        href="/contact"
                        className="font-bold text-blue-500 underline hover:text-blue-700"
                      >
                        Ready Set Group
                      </a>{" "}
                      now!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Right Column - Image and Card */}
              <div className="space-y-6">
                {/* Resource Card with Image */}
                <div className="bg-yellow-400 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={guide.title}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-center mb-2">
                        {guide.title}
                      </h2>
                      <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                      <p className="text-center text-sm">
                        {guide.subtitle || "A Business Owner's Guide"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Logo */}
                <Logo />
                
                {/* Download Button - Now scrolls to the download section */}
                {hasDownloadableFiles && (
                  <div className="mt-6 text-center">
                    <a
                      href="#download"
                      className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition duration-200"
                    >
                      Download Guide
                    </a>
                  </div>
                )}
                
                {/* Consultation button with custom text */}
                {guide.calendarUrl && (
                  <div className="mt-4 text-center">
                    <a
                      href={guide.calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
                    >
                      {guide.consultationCta || "Schedule a Consultation"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <BackArrow />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const guides = await client.fetch(`*[_type == "guide"]{
      "slug": slug.current
    }`);
    
    return guides.map((guide: { slug: string }) => ({
      slug: guide.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; // Return empty array to prevent build errors
  }
}