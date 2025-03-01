import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";
import BookNow from "./BookNow";
import NewsLetterSignup from "../Resources/ui/NewsLetterSignUp";

interface PostsProps {
  data: SimpleBlogCard[];
  basePath: string;
}

const SingleBlog = ({ data, basePath }: PostsProps) => {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <div
          key={post._id}
          className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
        >
          <div className="flex-shrink-0 p-4">
            <h3 className="line-clamp-2 text-xl font-semibold text-gray-800 hover:text-primary dark:text-white dark:hover:text-primary">
              <Link href={`/${basePath}/${post.slug?.current}`}>
                {post.title}
              </Link>
            </h3>
          </div>
          <div className="relative aspect-video w-full">
            {" "}
            {/* 16:9 aspect ratio */}
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
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image
                  </span>
                </div>
              )}
            </Link>
          </div>
          <div className="flex-grow p-4">
            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300"></p>
          </div>
          <div className="mt-auto flex items-center justify-between px-4 pb-4">
            {/* Fecha del post */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {post._updatedAt
                ? new Date(post._updatedAt).toLocaleDateString("en-EN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date not available"}
            </span>
            {/* Botón Read More */}
            <div className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              <Link
                href={`/${basePath}/${post.slug?.current}`}
                className="block"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleBlog;
