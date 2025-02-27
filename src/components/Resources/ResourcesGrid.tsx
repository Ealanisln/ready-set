import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Update this interface to match your Sanity data structure
interface Guide {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string; // From Sanity, this should already be the slug string
  coverImage?: {
    url: string;
  };
  category?: {
    title: string;
    slug: string;
  };
}

interface ResourcesGridProps {
  guides: Guide[];
  basePath: string;
}

const ResourcesGrid = ({ guides, basePath }: ResourcesGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <Link 
          href={`/${basePath}/${guide.slug}`} 
          key={guide._id}
          className="group rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md"
        >
          {guide.coverImage?.url && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={guide.coverImage.url}
                alt={guide.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <h3 className="mb-2 text-xl font-semibold">{guide.title}</h3>
          {guide.subtitle && (
            <p className="text-gray-700">{guide.subtitle}</p>
          )}
          {guide.category && (
  <div className="mt-3">
    <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm text-gray-800">
      Learn More
    </span>
  </div>
)}
        </Link>
      ))}
    </div>
  );
};

export default ResourcesGrid;