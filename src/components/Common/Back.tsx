"use client";

import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const handleBack = () => {
    // In a real app, you might want to use your routing library's navigation
    window.location.href = "/free-resources/";
  };

  return (
    <div className="flex w-full justify-center">
      <button
        onClick={handleBack}
        className="inline-flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 hover:text-gray-900"
        aria-label="Back to resources"
      >
        <ArrowLeft className="mr-2 h-8 w-8" />
        <span className="text-base font-medium">Back to Resources</span>
      </button>
    </div>
  );
};

export default BackArrow;
