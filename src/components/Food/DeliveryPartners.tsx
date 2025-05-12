'use client';

import Image from 'next/image';
import React, { useState, useMemo, useEffect } from 'react';

// Custom icons for navigation
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

interface Partner {
  name: string;
  logo: string;
}

const DeliveryPartners: React.FC = () => {
  const partners: Partner[] = useMemo(
    () => [
      { name: 'Foodee', logo: '/images/food/partners/foodee.jpg' },
      { name: 'Destino', logo: '/images/food/partners/destino.png' },
      { name: 'Conviva', logo: '/images/food/partners/conviva.png' },
      { name: 'Kasa Indian Eatery', logo: '/images/food/partners/kasa.png' },
      { name: 'CaterValley', logo: '/images/food/partners/catervalley.png' },
      { name: 'Deli', logo: '/images/food/partners/deli.jpg' },
      { name: 'Bobcha', logo: '/images/food/partners/bobcha.jpg' },
      // Add any additional partners here
    ],
    [],
  );

  // State for tracking which partners to show
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [partnersPerView, setPartnersPerView] = useState<number>(4);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedDot, setSelectedDot] = useState<number>(0);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      const mobileView = width < 768;
      setIsMobile(mobileView);

      // On mobile, we'll show fewer cards
      if (mobileView) {
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
      const newIndex =
        prev === 0
          ? Math.max(0, partners.length - partnersPerView)
          : Math.max(0, prev - partnersPerView);
      updateSelectedDot(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex =
        prev + partnersPerView >= partners.length
          ? 0
          : Math.min(partners.length - partnersPerView, prev + partnersPerView);
      updateSelectedDot(newIndex);
      return newIndex;
    });
  };

  // Update the selected dot based on current index
  const updateSelectedDot = (index: number) => {
    // Calculate which dot should be active based on the current index
    const totalGroups = Math.ceil(partners.length / partnersPerView);
    const dotIndex = Math.floor(index / partnersPerView) % totalGroups;
    setSelectedDot(dotIndex);
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

  // Calculate total number of dots needed (one for each group of partners)
  const totalDots = Math.ceil(partners.length / partnersPerView);

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Image with flowers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/food/deliverypartnersbg.png"
          alt="Flower shop background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-100 saturate-150"
        />
      </div>

      <div className="relative z-10 mt-0 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Centered logo */}
          <div className="relative flex w-full justify-center">
            <div className="absolute left-1/2 top-0 z-30 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[16px] border-black bg-yellow-400 shadow-lg">
              <Image
                src="/images/logo/new-logo-ready-set copy.png"
                alt="Ready Set Logo"
                width={100}
                height={100}
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>

          <div className="relative z-20 mb-24 mt-14 flex w-full max-w-4xl flex-col items-center rounded-[2rem] bg-white px-12 py-6 shadow-lg">
            <h2 className="mb-2 text-center text-4xl font-extrabold tracking-wide text-gray-900">
              OUR FOOD DELIVERY PARTNERS
            </h2>
            <p className="text-center text-lg font-medium text-gray-700">
              WE'RE PROUD TO COLLABORATE WITH SOME OF THE TOP NAMES IN THE INDUSTRY:
            </p>
          </div>
        </div>
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-0 left-0 z-20 w-full pb-2">
        <div className="relative w-full">
          <div className="w-full px-4 md:px-10">
            {/* Partners display */}
            <div className="flex justify-center gap-2 md:gap-3">
              {isMobile ? (
                // Mobile: Show fewer cards
                <div className="flex w-full justify-center">
                  {visiblePartners.map((partner, idx) => (
                    <div key={`${partner.name}-${idx}`} className="w-1/3 px-1">
                      <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-yellow-400 bg-white p-1 shadow-lg">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={180}
                          height={90}
                          className="h-auto w-auto max-w-full object-contain"
                          style={{ maxHeight: '95%', width: '95%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop: Standard layout
                visiblePartners.map((partner, idx) => (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="flex items-center justify-center md:basis-1/2 lg:basis-1/4"
                  >
                    <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-yellow-400 bg-white p-1 shadow-lg">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={240}
                        height={120}
                        className="h-auto w-auto max-w-full object-contain"
                        style={{ maxHeight: '95%', width: '95%' }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* New navigation layout with centered controls */}
            <div className="mt-8 flex items-center justify-center">
              {/* Left arrow button */}
              <button
                onClick={handlePrevious}
                className="flex h-20 w-20 items-center justify-center"
                aria-label="Previous partner"
              >
                <ArrowLeftIcon />
              </button>

              {/* Pagination dots */}
              <div className="mx-10 flex items-center space-x-6">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-5 w-5 rounded-full ${
                      selectedDot === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Right arrow button */}
              <button
                onClick={handleNext}
                className="flex h-20 w-20 items-center justify-center"
                aria-label="Next partner"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartners;
