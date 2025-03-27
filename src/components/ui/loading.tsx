"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = "Loading...", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-yellow-400 animate-spin"></div>
        <div 
          className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin opacity-70" 
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/80 z-50">
      <Loading message="Loading dashboard data..." />
    </div>
  );
}

// For non-overlay loading within containers
export function LoadingContainer({ className }: { className?: string }) {
  return (
    <div className={cn("w-full min-h-[400px] flex items-center justify-center", className)}>
      <Loading message="Loading..." />
    </div>
  );
}