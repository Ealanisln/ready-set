// src/components/Testimonials/index.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import page from './page';

const Testimonials = () => {
  interface Testimonial {
    category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
    name: string;
    role: string;
    text: string;
    image?: string;
  }

  // State to control which testimonial is active in each category
const [activeIndices, setActiveIndices] = useState({
  CLIENTS: 0,
  VENDORS: 0,
  DRIVERS: 0,
});

// State to control if autoplay is paused
const [isPaused, setIsPaused] = useState({
  CLIENTS: false,
  VENDORS: false,
  DRIVERS: false,
});

// State to control active category on mobile
const [activeMobileCategory, setActiveMobileCategory] = useState<
  'CLIENTS' | 'VENDORS' | 'DRIVERS'
>('CLIENTS');

// State to detect if we're in the browser
const [isBrowser, setIsBrowser] = useState(false);

// State to detect if we're on mobile
const [isMobile, setIsMobile] = useState(false);

// State to control if there is overflowing content - Memoized to avoid re-renders
const [hasOverflow, setHasOverflow] = useState<{
  CLIENTS: boolean[];
  VENDORS: boolean[];
  DRIVERS: boolean[];
}>({
  CLIENTS: [],
  VENDORS: [],
  DRIVERS: [],
});

// Add this effect after declaring all your states
useEffect(() => {
  // This code only runs on the client
  setIsBrowser(true);
  setIsMobile(window.innerWidth < 768);

  // Add listener to detect window size changes
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Refs for testimonial containers
const cardRefs = useRef<{ [key: string]: (HTMLDivElement | null)[] }>({
  CLIENTS: [],
  VENDORS: [],
  DRIVERS: [],
});

// Cache for preloaded images
const preloadedImages = useRef<Set<string>>(new Set());

// Now the useMemo to group testimonials will only recalculate if the testimonials reference changes
const groupedTestimonials = useMemo(() => {
  return page.reduce(
    (acc, page) => {
      const category = page.category as keyof typeof acc;
      acc[category] = acc[category] || [];
      acc[category].push(page as Testimonial);
      return acc;
    },
    {} as Record<Testimonial['category'], Testimonial[]>,
  );
}, []); // This dependency now comes from the import

const checkContentOverflow = useCallback(() => {
  // Limit the frequency of state updates to avoid excessive re-renders
  if ((window as any).overflowThrottleTimeout) {
    clearTimeout((window as any).overflowThrottleTimeout);
  }

  (window as any).overflowThrottleTimeout = setTimeout(() => {
    const newHasOverflow = { ...hasOverflow };

    Object.keys(groupedTestimonials).forEach((category) => {
      const categoryKey = category as 'CLIENTS' | 'VENDORS' | 'DRIVERS';
      const items = groupedTestimonials[categoryKey] || [];

      if (!cardRefs.current[categoryKey]) {
        cardRefs.current[categoryKey] = [];
      }

      items.forEach((_, index) => {
        const element = cardRefs.current[categoryKey][index];
        if (element) {
          const hasContentOverflow = element.scrollHeight > element.clientHeight;

          // Initialize the array if it doesn't exist
          if (!newHasOverflow[categoryKey]) {
            newHasOverflow[categoryKey] = [];
          }

          // Assign the overflow value only if it changes
          if (newHasOverflow[categoryKey][index] !== hasContentOverflow) {
            newHasOverflow[categoryKey][index] = hasContentOverflow;
          }
        }
      });
    });

    // Only update the state if there are actual changes
    const hasChanged = JSON.stringify(newHasOverflow) !== JSON.stringify(hasOverflow);
    if (hasChanged) {
      setHasOverflow(newHasOverflow);
    }
  }, 300);
}, [groupedTestimonials, hasOverflow]);

// Check if there's overflow in each active testimonial
useEffect(() => {
  // Verify overflow if we're in the browser
  if (isBrowser) {
    // Check after a brief delay to ensure content is rendered
    const timeoutId = setTimeout(checkContentOverflow, 300);

    return () => clearTimeout(timeoutId);
  }
}, [groupedTestimonials, isBrowser, activeIndices, activeMobileCategory, checkContentOverflow]);

// Functions to control navigation
const nextTestimonial = useCallback(
  (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
    const items = groupedTestimonials[category] || [];
    if (items.length === 0) return;

    setActiveIndices((prev) => ({
      ...prev,
      [category]: (prev[category] + 1) % items.length,
    }));
  },
  [groupedTestimonials, setActiveIndices],
);

const prevTestimonial = useCallback(
  (category: 'CLIENTS' | 'VENDORS' | 'DRIVERS') => {
    const items = groupedTestimonials[category] || [];
    if (items.length === 0) return;

    setActiveIndices((prev) => ({
      ...prev,
      [category]: (prev[category] - 1 + items.length) % items.length,
    }));
  },
  [groupedTestimonials, setActiveIndices],
);

// Use requestAnimationFrame instead of setInterval for better performance and to avoid flickering
useEffect(() => {
  let animationFrameIds: number[] = [];
  let lastTimestamps: Record<string, number> = {};

  // Function that coordinates all animations
  const animate = (timestamp: number) => {
    // Process each category
    Object.keys(groupedTestimonials).forEach((category) => {
      const categoryKey = category as 'CLIENTS' | 'VENDORS' | 'DRIVERS';

      // Initialize timestamp if necessary
      if (!lastTimestamps[categoryKey]) {
        lastTimestamps[categoryKey] = timestamp;
      }

      // Calculate elapsed time since last change
      const elapsed = timestamp - lastTimestamps[categoryKey];

      // Change every 10 seconds (10000ms) if not paused
      // Longer time to reduce changes and possible flickering
      if (elapsed > 10000 && !isPaused[categoryKey]) {
        nextTestimonial(categoryKey);
        lastTimestamps[categoryKey] = timestamp;
      }
    });

    // Continue the animation
    const id = requestAnimationFrame(animate);
    animationFrameIds.push(id);
  };

  // Start the animation
  const id = requestAnimationFrame(animate);
  animationFrameIds.push(id);

  // Cleanup when unmounting
  return () => {
    animationFrameIds.forEach((id) => cancelAnimationFrame(id));
  };
}, [isPaused, groupedTestimonials, nextTestimonial]);

// Memoized star component to avoid re-renders
const StarRating = React.memo(
  ({ count = 5, position = 'right' }: { count?: number; position?: 'right' | 'left' }) => (
    <div
      className={`-mt-2 flex rounded-md bg-white px-0 py-0 sm:mt-0 ${position === 'left' ? 'justify-end' : 'justify-start'}`}
    >
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className="h-8 w-8 text-yellow-400 sm:h-7 sm:w-7"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  ),
);

// Improved scroll arrow component
const ScrollArrow = React.memo(() => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  // Reference for the current container element
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the parent element with scroll (the card)
    if (arrowRef.current) {
      let parent = arrowRef.current.parentElement;

      // Look for the first parent with overflow auto or scroll
      while (parent && !['auto', 'scroll'].includes(getComputedStyle(parent).overflowY)) {
        parent = parent.parentElement;
      }

      setScrollElement(parent);

      // Set the maximum available scroll
      if (parent) {
        setMaxScroll(parent.scrollHeight - parent.clientHeight);
      }
    }
  }, []);

  useEffect(() => {
    if (!scrollElement) return;

    // Function to handle the scroll event
    const handleScroll = () => {
      // Get current scroll position
      const currentPosition = scrollElement.scrollTop;
      setScrollPosition(currentPosition);

      // Update maximum scroll (can change if content changes)
      setMaxScroll(scrollElement.scrollHeight - scrollElement.clientHeight);
    };

    // Run once at the beginning to verify initial state
    handleScroll();

    // Add the event listener
    scrollElement.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollElement]);

    // Calculate the dynamic position and opacity of the arrow
    const arrowPosition = Math.min(80, 20 + (scrollPosition / maxScroll) * 60);
    const arrowOpacity = maxScroll > 0 ? 1 - (scrollPosition / maxScroll) * 1.3 : 0;

    return (
      <div
        ref={arrowRef}
        className={`absolute left-1/2 -translate-x-1/2 transform transition-all duration-200`}
        style={{
          bottom: `${arrowPosition}px`,
          opacity: Math.max(0, arrowOpacity),
          visibility: arrowOpacity <= 0.1 ? 'hidden' : 'visible',
        }}
      >
        <div className={`animate-bounce`}>
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  });

  // Mobile navigation component for testimonials
  const MobileNavigation = React.memo(
    ({
      category,
      currentIndex,
      totalItems,
      onPrev,
      onNext,
    }: {
      category: 'CLIENTS' | 'VENDORS' | 'DRIVERS';
      currentIndex: number;
      totalItems: number;
      onPrev: () => void;
      onNext: () => void;
    }) => {
      
      const handlePrev = (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        onPrev();
      };
  
      const handleNext = (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        onNext();
      };
  
      return (
        <div className="absolute bottom-[-20px] left-0 right-0 z-10 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              onTouchStart={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white/80 backdrop-blur-[2px] transition-all hover:bg-black/50 active:scale-95 touch-manipulation"
              aria-label="Previous testimonial"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              onTouchStart={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white/80 backdrop-blur-[2px] transition-all hover:bg-black/50 active:scale-95 touch-manipulation"
              aria-label="Next testimonial"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      );
    }
  );
  
  // Profile image component with static loading to avoid flickering
  const ProfileImage = React.memo(({ imageSrc, alt }: { imageSrc?: string; alt: string }) => {
    // Simplify image handling logic and use placeholders consistently
    // This prevents the component from changing state and causing re-renders

    return (
      <div className="z-10 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-lg sm:h-20 sm:w-20">
        {/* Preload image with hidden visibility to verify if it loads correctly */}
        {imageSrc && (
          <div className="relative h-full w-full">
            {/* Use inline styles to avoid DOM changes that cause flickering */}
            <div
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
              }}
              aria-label={alt}
            />

            {/* Fallback image that only displays if the other fails */}
            <div
              className="fallback-image"
              style={{
                backgroundImage: `url(/api/placeholder/80/80)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
              }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* If there's no image, show placeholder */}
        {!imageSrc && (
          <div
            style={{
              backgroundImage: `url(/api/placeholder/80/80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
            aria-label={alt}
          />
        )}
      </div>
    );
  });

  // Memoized category selector for mobile
  const CategorySelector = React.memo(() => (
    <div className="my-6 flex flex-wrap justify-center gap-2 md:hidden">
      {Object.keys(groupedTestimonials).map((category) => (
        <button
          key={category}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === activeMobileCategory
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
          onClick={() => setActiveMobileCategory(category as 'CLIENTS' | 'VENDORS' | 'DRIVERS')}
        >
          {category}
        </button>
      ))}
    </div>
  ));

  // If we're not in the browser, render an empty container
  if (!isBrowser) {
    return (
      <div className="rounded-lg border border-black bg-white px-4 py-10">
        Loading Testimonials...
      </div>
    );
  }
  return (
    <section
      id="testimonials"
      className="w-full rounded-none border-x-0 border-b-0 border-t border-black bg-white px-0 py-10 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Updated header section with dotted lines extending from title */}
        <div className="relative mb-8 text-center sm:mb-12">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
            What People Say About Us
          </h2>

          {/* Real Stories. Real Impact with dotted lines extending from both sides */}
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <div className="relative flex w-full items-center justify-center">
              {/* Left dotted line */}
              <div className="absolute right-1/2 mr-4 w-1/4 border-t-2 border-dashed border-black sm:w-1/2"></div>

              {/* Text in the middle */}
              <p className="relative z-10 bg-white px-4 text-lg text-black sm:text-xl">
                Real Stories. Real Impact
              </p>

              {/* Right dotted line */}
              <div className="absolute left-1/2 ml-4 w-1/4 border-t-2 border-dashed border-black sm:w-1/2"></div>
            </div>
          </div>

          <p className="mx-auto max-w-2xl text-sm text-black sm:text-base">
            See how Ready Set is making a difference for our clients, vendors, and drivers
          </p>
        </div>

        {/* Category selector for mobile */}
        <CategorySelector />

        {/* Additional space between selector and content on mobile */}
        <div className="h-4 md:h-0"></div>

        {/* Three-column grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Object.entries(groupedTestimonials).map(([category, items]) => {
            // On mobile, only show the active category
            const isCategoryVisible = !isMobile || category === activeMobileCategory;

            return (
              <div
                key={category}
                className={`relative transition-all duration-300 ${
                  isCategoryVisible ? 'block' : 'hidden md:block'
                }`}
              >
                {/* Container with dotted border */}
                <div className="relative border-2 border-dotted border-black p-4 pb-6 pt-10 sm:p-6 sm:pt-12">
                  {/* Category title */}
                  <div className="absolute -top-5 left-0 w-full text-center">
                    <h3 className="inline-block bg-white px-4 text-xl font-bold text-black sm:px-6 sm:text-2xl">
                      {category}
                    </h3>
                  </div>

                  {/* Subtitle */}
                  <div className="-mt-6 mb-14 text-center sm:-mt-9 sm:mb-16">
                    <p className="text-xs text-black sm:text-sm">
                      {category === 'CLIENTS' && 'Why Our Clients Love Us'}
                      {category === 'VENDORS' && 'Trusted Partners for Seamless Operations'}
                      {category === 'DRIVERS' && 'Our Drivers, Our Heroes'}
                    </p>
                  </div>

                  {/* Manual carousel */}
                  <div
                    className="relative h-[400px] sm:h-[500px]"
                    onMouseEnter={() => setIsPaused({ ...isPaused, [category]: true })}
                    onMouseLeave={() => setIsPaused({ ...isPaused, [category]: false })}
                    onTouchStart={() => setIsPaused({ ...isPaused, [category]: true })}
                    onTouchEnd={() =>
                      setTimeout(() => setIsPaused({ ...isPaused, [category]: false }), 5000)
                    }
                  >
                    
                    <MobileNavigation
                      category={category as 'CLIENTS' | 'VENDORS' | 'DRIVERS'}
                      currentIndex={activeIndices[category as keyof typeof activeIndices]}
                      totalItems={items.length}
                      onPrev={() => prevTestimonial(category as 'CLIENTS' | 'VENDORS' | 'DRIVERS')}
                      onNext={() => nextTestimonial(category as 'CLIENTS' | 'VENDORS' | 'DRIVERS')}
                    />
                

                    {/* Container with animation using Motion */}
                    <div className="h-full">
                      <AnimatePresence mode="wait">
                        {items.map((testimonial, index) => {
                          const isActive =
                            index === activeIndices[category as keyof typeof activeIndices];
                          // Alternate layout on mobile for consistency
                          const layoutStyle = isMobile ? index % 2 === 0 : index % 2 === 0;

                          // Check if this testimonial has overflow
                          const cardHasOverflow =
                            hasOverflow[category as keyof typeof hasOverflow]?.[index];

                          // Only show the active testimonial for animation
                          if (!isActive) return null;

                          return (
                            <motion.div
                              key={`${category}-${index}`}
                              className="absolute inset-0"
                              initial={{
                                opacity: 0,
                                x: layoutStyle ? -30 : 30,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: {
                                  duration: 0.4,
                                  ease: 'easeOut',
                                },
                              }}
                              exit={{
                                opacity: 0,
                                x: layoutStyle ? 30 : -30,
                                transition: {
                                  duration: 0.3,
                                  ease: 'easeIn',
                                },
                              }}
                              style={{
                                willChange: 'transform, opacity',
                              }}
                            >
                              <div className="relative h-full pt-6">
                                {layoutStyle ? (
                                  // Left-aligned card (odd indices - first card)
                                  <>
                                    {/* Profile Image - Left positioned - Closer to the card on mobile */}
                                    <motion.div
                                      className="absolute -top-4 left-4 z-10 sm:-top-8 sm:left-8"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: { delay: 0.2, duration: 0.3 },
                                      }}
                                    >
                                      <ProfileImage
                                        imageSrc={testimonial.image}
                                        alt={testimonial.name}
                                      />
                                    </motion.div>

                                    {/* Star Rating - Repositioned on mobile (lower) */}
                                    <motion.div
                                      className="absolute left-1/2 top-2 z-20 -translate-x-1/2 transform sm:-top-4 sm:left-[60%] sm:-translate-x-1/2"
                                      initial={{ y: -10, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.4, duration: 0.3 },
                                      }}
                                    >
                                      <StarRating count={5} />
                                    </motion.div>

                                    {/* Card with testimonial */}
                                    <motion.div
                                      ref={(el) => {
                                        if (!cardRefs.current[category]) {
                                          cardRefs.current[category] = [];
                                        }
                                        cardRefs.current[category][index] = el;
                                      }}
                                      className="relative mt-2 max-h-[320px] overflow-y-auto rounded-xl bg-yellow-400 p-4 pt-6 text-black shadow-lg sm:mt-0 sm:max-h-[400px] sm:p-6 sm:pt-8"
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.1, duration: 0.4 },
                                      }}
                                    >
                                      <div className="mb-3 sm:mb-4">
                                        <h4 className="text-base font-bold sm:text-lg">
                                          {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-yellow-800 sm:text-sm">
                                          {testimonial.role}
                                        </p>
                                      </div>
                                      <p className="text-xs leading-relaxed sm:text-sm">
                                        {testimonial.text}
                                      </p>

                                     {/* Scroll indicator if there's overflow (mobile and desktop) */}
                                     {cardHasOverflow && (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{
                                            opacity: 1,
                                            transition: { delay: 0.6, duration: 0.3 },
                                          }}
                                        >
                                          <ScrollArrow />
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </>
                                ) : (
                                  // Right-aligned card (even indices - second card)
                                  <>
                                    {/* Profile Image - Right positioned - Closer to the card on mobile */}
                                    <motion.div
                                      className="absolute -top-4 right-4 z-10 sm:-top-8 sm:right-8"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: { delay: 0.2, duration: 0.3 },
                                      }}
                                    >
                                      <ProfileImage
                                        imageSrc={testimonial.image}
                                        alt={testimonial.name}
                                      />
                                    </motion.div>

                                    {/* Star Rating - Repositioned on mobile (lower) */}
                                    <motion.div
                                      className="absolute right-1/2 top-2 z-20 translate-x-1/2 transform sm:-top-4 sm:right-[60%] sm:translate-x-1/2"
                                      initial={{ y: -10, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.4, duration: 0.3 },
                                      }}
                                    >
                                      <StarRating count={5} />
                                    </motion.div>

                                    {/* Card with testimonial - Adjusted padding on mobile */}
                                    <motion.div
                                      ref={(el) => {
                                        if (!cardRefs.current[category]) {
                                          cardRefs.current[category] = [];
                                        }
                                        cardRefs.current[category][index] = el;
                                      }}
                                      className="relative mt-2 max-h-[320px] overflow-y-auto rounded-xl bg-black p-4 pr-4 pt-6 text-white shadow-lg sm:mt-0 sm:max-h-[400px] sm:p-6 sm:pr-24 sm:pt-8"
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.1, duration: 0.4 },
                                      }}
                                    >
                                      <div className="mb-3 sm:mb-4">
                                        <h4 className="text-base font-bold sm:text-lg">
                                          {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-yellow-400 sm:text-sm">
                                          {testimonial.role}
                                        </p>
                                      </div>
                                      <p className="text-xs leading-relaxed sm:text-sm">
                                        {testimonial.text}
                                      </p>

                                      {/* Scroll indicator if there's overflow (mobile and desktop) */}
                                      {cardHasOverflow && (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{
                                            opacity: 1,
                                            transition: { delay: 0.6, duration: 0.3 },
                                          }}
                                        >
                                          <ScrollArrow />
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
