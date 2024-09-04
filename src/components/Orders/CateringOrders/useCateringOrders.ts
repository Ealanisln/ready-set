"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Order, StatusFilter } from "./types";

const useCateringOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `/api/orders/catering-orders?page=${page}&limit=${limit}${
        statusFilter !== "all" ? `&status=${statusFilter}` : ""
      }`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch catering orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, statusFilter]);

  const handleNextPage = useCallback(() => setPage((prev) => prev + 1), []);
  const handlePrevPage = useCallback(() => setPage((prev) => Math.max(1, prev - 1)), []);

  const handleStatusFilter = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  return useMemo(() => ({
    orders,
    isLoading,
    error,
    page,
    statusFilter,
    handleNextPage,
    handlePrevPage,
    handleStatusFilter,
  }), [orders, isLoading, error, page, statusFilter, handleNextPage, handlePrevPage, handleStatusFilter]);
};

export default useCateringOrders;