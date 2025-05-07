'use client';

import Image from 'next/image';
import React, { useState, useMemo, useEffect } from 'react';

// Custom icons for navigation
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

type Partner = string;

const ExpertSupportSection: React.FC = () => {
  const partners: Partner[] = useMemo(
    () => [
      'FTD',
      'Bloom Link',
      'H Bloom',
      'Dove / Teleflora',
      'Lovingly',
      'Floom',
      'Bloom Nation',
      'Flower Shop Network',
    ],
    [],
  );

  // State for tracking which partners to show
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [partnersPerView, setPartnersPerView] = useState<number>(4);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      const mobileView = width < 768;
      setIsMobile(mobileView);

      // On mobile, we'll show a fixed number of cards
      if (mobileView) {
        // Show exactly 3 cards on mobile
        setPartnersPerView(3);
      } else {
        // On larger screens, show 4 cards
        setPartnersPerView(4);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return partners.length - partnersPerView;
      return Math.max(0, prev - partnersPerView);
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev + partnersPerView >= partners.length) return 0;
      return Math.min(partners.length - partnersPerView, prev + partnersPerView);
    });
  };

  // Calculate which partners to display
  const visiblePartners = useMemo(() => {
    const result = [...partners];

    // If we're approaching the end, add partners from the beginning to ensure smooth cycling
    if (currentIndex + partnersPerView > partners.length) {
      const neededFromStart = currentIndex + partnersPerView - partners.length;
      return [...result.slice(currentIndex), ...result.slice(0, neededFromStart)];
    }

    return result.slice(currentIndex, currentIndex + partnersPerView);
  }, [currentIndex, partners, partnersPerView]);

  // Function to format partner name for mobile view (split into two lines if needed)
  const formatMobilePartnerName = (name: string): React.ReactNode => {
    // Check if the name is too long or contains a slash
    if (name.length > 8 || name.includes('/')) {
      // For names with slashes, split at the slash
      if (name.includes('/')) {
        const parts = name.split('/');
        return (
          <>
            {parts[0].trim()}
            <br />
            {parts[1].trim()}
          </>
        );
      }

      // For long names without slashes, find a good split point
      const words = name.split(' ');

      if (words.length > 1) {
        // If there are multiple words, split between words
        const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
        const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

        return (
          <>
            {firstHalf}
            <br />
            {secondHalf}
          </>
        );
      } else if (name.length > 10) {
        // For a single long word, split in the middle
        const midpoint = Math.ceil(name.length / 2);
        return (
          <>
            {name.substring(0, midpoint)}
            <br />
            {name.substring(midpoint)}
          </>
        );
      }
    }

    // Default: return the name as is
    return name;
  };

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Image with flowers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/flowers/flower5.jpg"
          alt="Flower shop background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-100 saturate-150"
        />
      </div>

      {/* Centered white box */}
      <div className="relative z-10 mt-0 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Centered logo */}
          <div className="relative flex w-full justify-center">
            <div className="absolute left-1/2 top-0 z-30 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[20px] border-black bg-yellow-400 shadow-lg">
              <Image
                src="/images/logo/new-logo-ready-set copy.png"
                alt="Ready Set Logo"
                width={120}
                height={120}
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>
          <div className="relative z-20 mt-16 flex w-full flex-col items-center rounded-[2.5rem] bg-white px-8 py-8 shadow-xl md:w-[700px]">
            <h2 className="mb-2 text-center text-3xl font-extrabold tracking-wide text-gray-900">
              EXPERT SUPPORT
            </h2>
            <p className="text-center text-base font-medium text-gray-700">
              WE SPECIALIZE IN FLORAL LOGISTICS, ENSURING SMOOTH DELIVERIES AND STRONG PARTNERSHIPS
              WITH LOCAL SHOPS FOR A SEAMLESS EXPERIENCE.
            </p>
          </div>
        </div>
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-0 left-0 z-20 w-full pb-6">
        <div className="relative w-full">
          <div className="w-full px-10 md:px-12">
            {/* Partners display */}
            <div className="flex justify-center gap-3 px-2 md:gap-5">
              {isMobile ? (
                // Mobile: Show exactly 3 cards that fit perfectly
                <div className="flex w-full justify-center">
                  {visiblePartners.map((partner, idx) => (
                    <div key={`${partner}-${idx}`} className="w-1/3 px-1">
                      <div
                        className="flex h-full w-full items-center justify-center rounded-2xl border-4 border-yellow-400 bg-yellow-400 px-2 py-3 text-sm font-extrabold text-gray-800 shadow-lg"
                        style={{ textAlign: 'center' }}
                      >
                        {formatMobilePartnerName(partner)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop: Standard layout with 4 cards - no formatting change here
                visiblePartners.map((partner, idx) => (
                  <div
                    key={`${partner}-${idx}`}
                    className="flex items-center justify-center md:basis-1/2 lg:basis-1/4"
                  >
                    <div
                      className="flex w-full min-w-0 items-center justify-center whitespace-nowrap rounded-2xl border-4 border-yellow-400 bg-yellow-400 px-4 py-4 text-2xl font-extrabold text-gray-800 shadow-lg"
                      style={{ textAlign: 'center' }}
                    >
                      {partner}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-[40%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-[#F8CC48] shadow-xl hover:bg-[#F8CC48]/80 md:h-12 md:w-12"
              aria-label="Previous partner"
            >
              <ArrowLeftIcon />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-[40%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-[#F8CC48] shadow-xl hover:bg-[#F8CC48]/80 md:h-12 md:w-12"
              aria-label="Next partner"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertSupportSection;
