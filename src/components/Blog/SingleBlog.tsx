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
  const { start, end, total, currentItems, totalPages } = calculatePaginationInfo();

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
    <div className="w-full max-w-7xl mx-auto">
      {/* Grid de blogs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {currentItems.map((post) => (
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
                
              </p>
            </div>
            <div className="px-4 pb-4 mt-auto flex justify-between items-center">
              {/* Fecha del post */}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post._updatedAt ? 
                  new Date(post._updatedAt).toLocaleDateString('en-EN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  : 'Date not available'
                }
              </span>
              {/* Botón Read More */}
              <div className="inline-block px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                <Link href={`/${basePath}/${post.slug?.current}`} className="block">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información y controles de paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {start} to {end} of {total} blogs
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {/* Botón Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/80"
              }`}
            >
              Previous
            </button>
            
            {/* Números de página */}
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === number
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {number}
              </button>
            ))}
            
            {/* Botón Siguiente */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/80"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;