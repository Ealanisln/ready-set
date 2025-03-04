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
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 9 blogs por página

  // Cálculo de la información de paginación
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

  // Obtener la información de paginación
  const { start, end, total, currentItems, totalPages } =
    calculatePaginationInfo();

  // Función para cambiar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Opcional: hacer scroll al inicio de la lista
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Generar array con números de página para el renderizado
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Grid de blogs */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((post) => (
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
              <Link
                href={`/${basePath}/${post.slug?.current}`}
                className="block"
              >
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

      {/* Información y controles de paginación */}
      {totalPages > 1 && (
        <div className="mb-12 mt-20 flex flex-col items-center">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {start} to {end} of {total} blogs
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            {/* Botón Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-500 hover:text-yellow-600"
              }`}
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
              Previous Page
            </button>

            {/* Números de página */}
            <div className="mx-4 flex items-center gap-1">
              {/* Always show page 1 */}
              <button
                onClick={() => handlePageChange(1)}
                className={`flex h-10 w-10 items-center justify-center ${
                  currentPage === 1
                    ? "font-bold text-yellow-600"
                    : "text-gray-700 hover:text-yellow-600 dark:text-gray-300"
                }`}
              >
                1
              </button>

              {/* Show ellipsis if currentPage > 3 */}
              {currentPage > 3 && <span className="px-1">...</span>}

              {/* Show page numbers around current page */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;

                // Show current page and one page before and after (if they exist)
                if (
                  pageNumber > 1 &&
                  pageNumber < totalPages && // Not first or last page
                  (pageNumber === currentPage ||
                    pageNumber === currentPage - 1 ||
                    pageNumber === currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex h-10 w-10 items-center justify-center ${
                        currentPage === pageNumber
                          ? "font-bold text-yellow-600"
                          : "text-gray-700 hover:text-yellow-600 dark:text-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if currentPage < totalPages - 2 */}
              {currentPage < totalPages - 2 && (
                <span className="px-1">...</span>
              )}

              {/* Always show last page if totalPages > 1 */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`flex h-10 w-10 items-center justify-center ${
                    currentPage === totalPages
                      ? "font-bold text-yellow-600"
                      : "text-gray-700 hover:text-yellow-600 dark:text-gray-300"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-500 hover:text-yellow-600"
              }`}
            >
              Next Page
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
