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
type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');

  // Check screen size and adjust layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        // Extra small devices - show 2 cards that are wider
        setScreenSize('xs');
        setPartnersPerView(2);
      } else if (width < 640) {
        // Small mobile devices
        setScreenSize('xs');
        setPartnersPerView(2);
      } else if (width < 768) {
        setScreenSize('sm');
        setPartnersPerView(2);
      } else if (width < 1024) {
        setScreenSize('md');
        setPartnersPerView(3);
      } else if (width < 1280) {
        setScreenSize('lg');
        setPartnersPerView(4);
      } else {
        setScreenSize('xl');
        setPartnersPerView(4);
      }
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return partners.length - partnersPerView;
      return Math.max(0, prev - 1); // Move by 1 for smoother scrolling
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev + partnersPerView >= partners.length) return 0;
      return Math.min(partners.length - partnersPerView, prev + 1); // Move by 1 for smoother scrolling
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

  // Function to format partner name for smaller screens
  const formatPartnerName = (name: string): React.ReactNode => {
    // Always check for slash regardless of screen size
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

    // For single words on smaller screens - prevent awkward breaks
    if ((screenSize === 'xs' || screenSize === 'sm') && !name.includes(' ')) {
      // For single words, don't break them unless extremely long (over 9 chars)
      if (name.length > 9) {
        // Find a vowel near the middle to create a natural break
        const midpoint = Math.floor(name.length / 2);
        let breakPoint = midpoint;

        // Try to find a more natural break point
        for (let i = midpoint; i > 0; i--) {
          if (/[aeiouy]/i.test(name[i])) {
            breakPoint = i + 1; // Break after the vowel
            break;
          }
        }

        return (
          <>
            {name.substring(0, breakPoint)}
            <br />
            {name.substring(breakPoint)}
          </>
        );
      }

      // For shorter single words (9 chars or less), don't break
      return name;
    }

    // For multi-word names on small screens
    if ((screenSize === 'xs' || screenSize === 'sm') && name.includes(' ')) {
      const words = name.split(' ');
      // Split between words
      const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

      return (
        <>
          {firstHalf}
          <br />
          {secondHalf}
        </>
      );
    }

    // Default: return the name as is
    return name;
  };

  // Calculate responsive logo size
  const getLogoSize = () => {
    switch (screenSize) {
      case 'xs':
        return 'h-[260px] w-[260px] mt-14 mb-10'; // Aumentado de 200px a 260px para hacer el logo más grande
      case 'sm':
        return 'h-[340px] w-[340px] mt-20 mb-14'; // Aumentado de 300px a 340px
      case 'md':
        return 'h-[450px] w-[450px] mt-28 mb-20';
      case 'lg':
      case 'xl':
        return 'h-[600px] w-[600px] mt-40 mb-28';
      default:
        return 'h-[600px] w-[600px] mt-40 mb-28';
    }
  };

  // Get card style classes based on screen size and partner name
  const getCardClasses = (partner: string) => {
    const nameLength = partner.length;
    let textSize = '';
    let padding = '';
    let minWidth = '';

    // Adjust text size based on name length and screen size
    if (screenSize === 'xs') {
      // Extra small screens - smallest text but with better width
      textSize = nameLength > 10 ? 'text-xs' : nameLength > 5 ? 'text-sm' : 'text-base';
      padding = 'py-1 px-3'; // Increased horizontal padding
      minWidth = 'min-w-[120px]'; // Increased from 90px to 120px
    } else if (screenSize === 'sm') {
      // Small screens
      textSize = nameLength > 10 ? 'text-sm' : 'text-base';
      padding = 'py-1.5 px-3'; // Increased horizontal padding
      minWidth = 'min-w-[140px]'; // Increased from 110px to 140px
    } else if (screenSize === 'md') {
      // Medium screens
      textSize = nameLength > 12 ? 'text-base' : 'text-lg';
      padding = 'py-2 px-3';
      minWidth = 'min-w-[160px]'; // Added min-width for medium screens
    } else {
      // Large screens
      textSize = nameLength > 15 ? 'text-lg' : 'text-xl';
      padding = 'py-3 px-4';
      minWidth = '';
    }

    return `${textSize} ${padding} ${minWidth}`;
  };

  return (
    <div className="relative flex min-h-[350px] w-full items-center justify-center overflow-hidden bg-gray-100 sm:min-h-[450px] md:min-h-[550px]">
      {/* Background Image with flowers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/flowers/flower5.jpg"
          alt="Flower shop background"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          className="opacity-100 saturate-150"
        />
      </div>

      {/* Main structure with relative positioning */}
      <div className="relative z-10 flex w-full max-w-[95%] flex-col items-center sm:max-w-[90%] md:max-w-[700px]">
        {/* Responsive logo image */}
        <div className={`relative z-10 ${getLogoSize()}`}>
          <Image
            src="/images/flowers/circlelogoreadyset.png"
            alt="Ready Set Logo"
            fill
            sizes="(max-width: 480px) 260px, (max-width: 640px) 300px, (max-width: 768px) 340px, (max-width: 1024px) 450px, 600px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-0 left-0 z-20 w-full pb-3 sm:pb-4 md:pb-6">
        <div className="relative w-full">
          <div className="w-full px-4 sm:px-6 md:px-10">
            {/* Partners display */}
            <div className="flex justify-center gap-1.5 px-1 sm:gap-2 md:gap-3 lg:gap-4">
              {visiblePartners.map((partner, idx) => {
                return (
                  <div
                    key={`${partner}-${idx}`}
                    className={`flex items-center justify-center ${
                      screenSize === 'xs'
                        ? 'w-[48%] max-w-[160px]' // Increased from 140px and using percentage width
                        : screenSize === 'sm'
                          ? 'w-[48%] max-w-[180px]' // Keeping percentage width
                          : screenSize === 'md'
                            ? 'w-1/3 max-w-[220px]' // Increased from 200px
                            : 'w-1/4 max-w-[240px]' // Increased from 220px
                    }`}
                  >
                    <div
                      className={`flex min-w-0 items-center justify-center whitespace-normal rounded-lg border-2 border-yellow-400 bg-yellow-400 ${getCardClasses(partner)} md:border-3 font-bold text-gray-800 shadow-lg sm:rounded-xl md:rounded-2xl lg:border-4 lg:font-extrabold`}
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        height:
                          screenSize === 'xs' ? '54px' : screenSize === 'sm' ? '60px' : 'auto', // Increased height
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {formatPartnerName(partner)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0.5 top-[40%] z-30 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-[#F8CC48] shadow-lg hover:bg-[#F8CC48]/80 sm:left-1 sm:h-8 sm:w-8 md:left-2 md:h-10 md:w-10 lg:h-12 lg:w-12"
              aria-label="Previous partner"
            >
              <div className="scale-75 sm:scale-90 md:scale-100">
                <ArrowLeftIcon />
              </div>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0.5 top-[40%] z-30 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-[#F8CC48] shadow-lg hover:bg-[#F8CC48]/80 sm:right-1 sm:h-8 sm:w-8 md:right-2 md:h-10 md:w-10 lg:h-12 lg:w-12"
              aria-label="Next partner"
            >
              <div className="scale-75 sm:scale-90 md:scale-100">
                <ArrowRightIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertSupportSection;
