// src/app/(site)/free-resources/[slug]/page.tsx

import { notFound } from "next/navigation";
import { resources } from "@/components/Resources/Data/Resources";  
import { generateSlug } from "@/lib/create-slug";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ResourcePage({ params }: PageProps) {
  // Make async
  const resolvedParams = await params; // Resolve the Promise
  const resource = resources.find(
    (r) => generateSlug(r.title) === resolvedParams.slug,
  );

  if (!resource) notFound();

  if (resource.component) {
    const Component = resource.component;
    return <Component />;
  }
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="prose max-w-none">
          <h1>{resource.title}</h1>
          <p>{resource.description}</p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  return {
    title: `Resource: ${resolvedParams.slug}`,
  };
}

export async function generateStaticParams() {
  return resources.map((resource) => ({
    slug: generateSlug(resource.title),
  }));
}
