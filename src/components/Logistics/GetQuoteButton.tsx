"use client";

import { useState } from 'react';
import ScrollToSection from '@/components/Common/ScrollToSection';

export default function QuoteButton() {
  const [shouldScroll, setShouldScroll] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShouldScroll(true)}
        className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
      >
        Get Quote
      </button>
      {shouldScroll && <ScrollToSection targetId="food-services" />}
    </>
  );
}