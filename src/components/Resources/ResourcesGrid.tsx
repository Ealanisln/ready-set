// components/Guides/GuideGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { GuideCard } from "@/types/guide";

interface GuideGridProps {
  guides: GuideCard[];
  basePath: string;
}

export default function GuideGrid({ guides, basePath }: GuideGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <Link
          key={guide._id}
          href={`/${basePath}/${guide.slug.current}`}
          className="group overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
        >
          {guide.coverImage && (
            <div className="relative h-48 w-full">
              <Image
                src={urlForImage(guide.coverImage)}
                alt={guide.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6">
            {guide.category && (
              <span className="mb-2 inline-block text-sm font-medium text-blue-600">
                {guide.category.title}
              </span>
            )}
            <h3 className="mb-2 text-xl font-bold">{guide.title}</h3>
            {guide.subtitle && (
              <p className="text-gray-600">{guide.subtitle}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}