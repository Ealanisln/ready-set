'use client';

import Image from 'next/image';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>('90vh');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Create a ref for the autoplay plugin
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

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

  // Calculate container height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const navbarHeight = 80; // Approximate height of your navbar

      // Set component height to be 90% of available height
      const availableHeight = viewportHeight - navbarHeight;
      setContainerHeight(`${availableHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      const mobileView = width < 768;
      setIsMobile(mobileView);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Function to format partner name for mobile view (split into two lines if needed)
  const formatMobilePartnerName = (name: string): React.ReactNode => {
    // Check if the name is too long or contains a slash
    if (name.length > 8 || name.includes('/')) {
      // For names with slashes, split at the slash
      if (name.includes('/')) {
        const parts = name.split('/');
        const firstPart = parts[0]?.trim() || '';
        const secondPart = parts[1]?.trim() || '';
        if (firstPart && secondPart) {
          return (
            <>
              {firstPart}
              <br />
              {secondPart}
            </>
          );
        }
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

  // Calculate number of items to show based on screen size
  const itemsPerView = isMobile ? 3 : 4;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center overflow-hidden bg-gray-100"
      style={{ height: containerHeight }}
    >
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

      {/* Only the image, no white container box */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Just the image centered */}
          <div className="relative flex w-full justify-center">
            <div className="z-30">
              <Image
                src="/images/flowers/expertsupport.png"
                alt="Expert Support"
                width={800}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-8 left-0 z-20 w-full">
        <div className="relative w-full">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              dragFree: false,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full px-4 md:px-8"
          >
            <CarouselContent className="!pl-0">
              {partners.map((partner, idx) => (
                <CarouselItem
                  key={`${partner}-${idx}`}
                  className={`${isMobile ? 'basis-1/3' : 'basis-1/4'} !pl-2 pr-2`}
                >
                  <div className="isolate overflow-hidden rounded-2xl">
                    <button
                      className="block w-full bg-yellow-400 px-4 py-2 text-center font-extrabold text-gray-800 shadow-lg transition-all duration-300 hover:bg-yellow-500"
                      style={{
                        fontSize: isMobile ? '0.875rem' : '1.5rem',
                      }}
                    >
                      {isMobile ? formatMobilePartnerName(partner) : partner}
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ExpertSupportSection;
