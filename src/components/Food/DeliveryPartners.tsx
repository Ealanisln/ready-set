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

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [partnersPerView, setPartnersPerView] = useState<number>(4);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedDot, setSelectedDot] = useState<number>(0);

  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      const mobileView = width < 768;
      setIsMobile(mobileView);

      if (mobileView) {
        setPartnersPerView(3);
      } else {
        setPartnersPerView(4);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const updateSelectedDot = (index: number) => {
    const totalGroups = Math.ceil(partners.length / partnersPerView);
    const dotIndex = Math.floor(index / partnersPerView) % totalGroups;
    setSelectedDot(dotIndex);
  };

  const visiblePartners = useMemo(() => {
    const result = [...partners];

    if (currentIndex + partnersPerView > partners.length) {
      const neededFromStart = currentIndex + partnersPerView - partners.length;
      return [...result.slice(currentIndex), ...result.slice(0, neededFromStart)];
    }

    return result.slice(currentIndex, currentIndex + partnersPerView);
  }, [currentIndex, partners, partnersPerView]);

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

      {/* Image moved higher with negative margin-top */}
      <div
        className="absolute left-0 right-0 top-0 z-30 mx-auto w-full max-w-3xl px-4 md:px-0"
        style={{ marginTop: '-40px' }} // Added negative margin to move it up
      >
        <Image
          src="/images/food/partners/deliverysupport.png"
          alt="Delivery Support"
          width={800}
          height={400}
          className="w-full rounded-xl shadow-xl"
          priority
        />
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-0 left-0 z-10 w-full pb-2">
        <div className="relative w-full">
          <div className="w-full px-4 md:px-10">
            {/* Partners display */}
            <div className="flex justify-center gap-2 md:gap-3">
              {isMobile ? (
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

            {/* Navigation controls */}
            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={handlePrevious}
                className="flex h-20 w-20 items-center justify-center"
                aria-label="Previous partner"
              >
                <ArrowLeftIcon />
              </button>

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
