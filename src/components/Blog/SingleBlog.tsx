import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
  basePath: string;
}

const SingleBlog = ({ data, basePath }: PostsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto">
      {data.map((post) => (
        <div key={post._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-4 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary line-clamp-2">
              <Link href={`/${basePath}/${post.slug?.current}`}>
                {post.title}
              </Link>
            </h3>
          </div>
          <div className="relative w-full aspect-video"> {/* 16:9 aspect ratio */}
            <Link href={`/${basePath}/${post.slug?.current}`} className="block">
              {post.mainImage ? (
                <Image
                  src={urlFor(post.mainImage).url()}
                  alt="Blog post image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
            </Link>
          </div>
          <div className="p-4 flex-grow">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {post.smallDescription}
            </p>
          </div>
          <div className="px-4 pb-4 mt-auto">
            <div className="inline-block px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
              {post._updatedAt.substring(0, 10)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleBlog;