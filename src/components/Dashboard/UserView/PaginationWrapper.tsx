import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxVisiblePages = 5;
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationPrevious className="pointer-events-none opacity-50" />
          </PaginationItem>
        )}
        
        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}
        
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        
        {currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationNext className="pointer-events-none opacity-50" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};