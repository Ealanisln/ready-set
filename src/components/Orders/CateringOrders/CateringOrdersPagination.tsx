// components/Orders/CateringOrders/CateringOrdersPagination.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface CateringOrdersPaginationProps {
  page: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const CateringOrdersPagination: React.FC<CateringOrdersPaginationProps> = ({
  page,
  onPrevPage,
  onNextPage,
}) => (
  <div className="mt-4 flex justify-between">
    <Button onClick={onPrevPage} disabled={page === 1}>
      Previous
    </Button>
    <Button onClick={onNextPage}>Next</Button>
  </div>
);