"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { SimpleBlogCard } from "@/types/simple-blog-card";

interface PostsProps {
  data: SimpleBlogCard[];
  basePath: string;
}

const SingleBlog = ({ data, basePath }: PostsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Changed from 9 to 6 for better UX on large screens

  // Calculate pagination info
  const calculatePaginationInfo = useCallback(() => {
    const total = data.length;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);
    return {
      start: total > 0 ? start + 1 : 0,
      end,
      total,
      currentItems: data.slice(start, end),
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }, [currentPage, itemsPerPage, data]);

  const { start, end, total, currentItems, totalPages } =
    calculatePaginationInfo();

  // Get featured post (first post)
  const featuredPost = useMemo(() => (data.length > 0 ? data[0] : null), [data]);
  
  // Get remaining posts for grid (excluding featured post if on first page)
  const gridPosts = useMemo(() => {
    if (currentPage === 1 && featuredPost) {
      return currentItems.slice(1); // Skip the featured post
    }
    return currentItems;
  }, [currentPage, featuredPost, currentItems]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryBadge = (category?: string) => {
    const colors: Record<string, string> = {
      Logistics: "bg-blue-100 text-blue-800",
      "Virtual Assistants": "bg-purple-100 text-purple-800",
      Business: "bg-yellow-100 text-yellow-800",
      Technology: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800",
    };
    
    return category 
      ? colors[category] || colors.default
      : colors.default;
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Featured Post - Only show on first page */}
      {currentPage === 1 && featuredPost && (
        <div className="mb-12 overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-video h-full w-full md:aspect-auto">
              {featuredPost.mainImage ? (
                <Image
                  src={urlFor(featuredPost.mainImage).url()}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                {featuredPost.categories && featuredPost.categories.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {featuredPost.categories.map((cat: any) => (
                      <span 
                        key={cat.title} 
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryBadge(cat.title)}`}
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  <Link 
                    href={`/${basePath}/${featuredPost.slug?.current}`}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
                {featuredPost.slug?.smallDescription && (
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    {featuredPost.slug.smallDescription}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(featuredPost._updatedAt)}
                </span>
                <Link
                  href={`/${basePath}/${featuredPost.slug?.current}`}
                  className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary/90"
                >
                  Read More
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-2 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog grid */}
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {gridPosts.map((post) => (
          <div
            key={post._id}
            className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg dark:bg-gray-800"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Link
                href={`/${basePath}/${post.slug?.current}`}
                className="block"
              >
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 hover:scale-105"
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

            <div className="flex flex-grow flex-col p-6">
              {post.categories && post.categories.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.categories.map((cat: any) => (
                    <span 
                      key={cat.title} 
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryBadge(cat.title)}`}
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}
              
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
                <Link 
                  href={`/${basePath}/${post.slug?.current}`}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {post.title}
                </Link>
              </h3>
              
              {post.slug?.smallDescription && (
                <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                  {post.slug.smallDescription}
                </p>
              )}
              
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(post._updatedAt)}
                </span>
                <Link
                  href={`/${basePath}/${post.slug?.current}`}
                  className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Read More
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-1 h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {start} to {end} of {total} posts
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              aria-label="Previous page"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="mx-2 flex items-center gap-1">
              {/* First page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  currentPage === 1
                    ? "bg-primary font-medium text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                aria-label="Page 1"
              >
                1
              </button>

              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <span className="px-1 text-gray-500 dark:text-gray-400">...</span>
              )}

              {/* Dynamic page numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;

                if (
                  pageNumber > 1 &&
                  pageNumber < totalPages &&
                  (pageNumber === currentPage ||
                    pageNumber === currentPage - 1 ||
                    pageNumber === currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex h-10 w-10 items-center justify-center rounded-md ${
                        currentPage === pageNumber
                          ? "bg-primary font-medium text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      aria-label={`Page ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}

              {/* Ellipsis if needed */}
              {currentPage < totalPages - 2 && (
                <span className="px-1 text-gray-500 dark:text-gray-400">...</span>
              )}

              {/* Last page */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${
                    currentPage === totalPages
                      ? "bg-primary font-medium text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;
