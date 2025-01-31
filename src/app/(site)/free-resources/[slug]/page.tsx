import { notFound } from 'next/navigation';
import { resources } from '@/data/resources';
import { generateSlug } from '@/lib/create-slug';

interface PageProps {
  params: Promise<{ // Wrap in Promise
    slug: string;
  }>;
}

export default async function ResourcePage({ params }: PageProps) { // Make async
  const resolvedParams = await params; // Resolve the Promise
  const resource = resources.find(
    (r) => generateSlug(r.title) === resolvedParams.slug
  );

  if (!resource) notFound();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">{resource.title}</h1>
        <div className="prose max-w-none">
          {resource.content}
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