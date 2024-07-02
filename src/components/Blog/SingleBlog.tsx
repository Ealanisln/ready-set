import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
}

const Posts = ({ data }: PostsProps) => {
  return (
    <div className="wow fadeInUp grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3" data-wow-delay=".1s">
      {data.map((post, idx) => (
        <div key={idx} className="mb-8 overflow-hidden rounded flex flex-col justify-between h-full">
          <div>
            <Link
              key={post._id}
              href={`/blogs/${post.slug?.current}`}
              className="block"
            >
              {post.mainImage ? (
                <Image
                  src={urlFor(post.mainImage).url()}
                  alt="Blog post image"
                  width={408}
                  height={272}
                  className="w-full rounded-sm object-cover transition"
                />
              ) : (
                <div className="flex h-[200px] items-center justify-center rounded-sm bg-gray-200">
                  <span>No Image</span>
                </div>
              )}
            </Link>
          </div>

          <div className="pt-4">
            <div className="mb-5 inline-block rounded bg-primary px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
              {post._updatedAt.substring(0, 10)}
            </div>
            <h3>
              <Link
                href={`/blogs/${post.slug?.current}`}
                className="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
              >
                {post.title}
              </Link>
            </h3>
            <p className="text-base text-body-color dark:text-dark-6">
              {post.smallDescription}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
