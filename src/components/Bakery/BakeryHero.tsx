'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ScheduleDialog from '../Logistics/Schedule';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface BakeryHeroProps {
  onRequestQuote?: () => void;
}

const BakeryHero: React.FC<BakeryHeroProps> = ({ onRequestQuote }) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const { openForm, DialogForm } = FormManager();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleQuoteClick = () => {
    console.log('BakeryHero - Get a quote clicked');
    openForm('bakery');
  };

  // Dynamic classes based on screen size
  const marginTopClass = {
    mobile: 'mt-16',
    tablet: 'mt-20',
    desktop: 'mt-24',
  }[screenSize];

  const circleSizeClass = {
    mobile: 'h-[280px] w-[280px]',
    tablet: 'h-[380px] w-[380px]',
    desktop: 'h-[500px] w-[500px]',
  }[screenSize];

  const imageContainerClass = {
    mobile: 'h-[350px] w-[350px] -mt-12',
    tablet: 'h-[450px] w-[450px] -mt-8',
    desktop: 'h-[600px] w-[600px]',
  }[screenSize];

  const imageScaleClass = {
    mobile: 'scale-[1.3]',
    tablet: 'scale-[1.4]',
    desktop: 'scale-[1.5]',
  }[screenSize];

  // New positioning classes for circle container
  const circlePositionClass = {
    mobile: 'flex justify-center',
    tablet: 'flex justify-center',
    desktop: 'flex justify-end',
  }[screenSize];

  return (
    <section className={`relative w-full ${marginTopClass} overflow-hidden`}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/food/truckbg.png"
          alt="Delivery truck background"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left content - Text */}
          <div className="relative z-10 w-full max-w-xl space-y-6 px-4 sm:px-6 lg:w-1/2 lg:px-0">
            <h1 className="font-[Montserrat] text-3xl font-black leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
              Your Go-To Delivery
              <br />
              Partner Since
              <br />
              <span className="text-yellow-400">2019</span>
            </h1>

            <p className="font-[Montserrat] text-sm leading-relaxed text-gray-900 sm:text-base lg:pr-8">
              Ready Set HQ, based in the San Francisco Bay Area, is expanding to Atlanta and Austin.
              We deliver daily team lunches, corporate events, and special occasions, trusted by top
              tech companies like Apple, Google, Facebook, and Netflix for our reliable catering
              delivery service. And we're not just about catering—we now deliver for local bakeries
              too!
            </p>

            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
              <button
                onClick={handleQuoteClick}
                className="w-full rounded-full bg-yellow-300 px-8 py-3 font-[Montserrat] font-bold text-gray-800 transition-colors hover:bg-yellow-400 sm:w-auto"
              >
                Get a Quote
              </button>
              <ScheduleDialog
                buttonText="Book a Call"
                calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                className="mt-3 w-full rounded-full bg-yellow-300 px-8 py-3 font-[Montserrat] font-bold text-gray-800 transition-colors hover:bg-yellow-400 sm:mt-0 sm:w-auto"
              />
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative mt-16 sm:mt-12 lg:mt-0 lg:w-1/2">
            <div className={`relative ${circlePositionClass}`}>
              {/* Yellow circular background */}
              <div className={`relative rounded-full bg-yellow-300 ${circleSizeClass}`}>
                {/* Bread basket image positioned on top of yellow circle */}
                <div
                  className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-visible ${imageContainerClass}`}
                >
                  <Image
                    src="/images/bakery/breadbasket.png"
                    alt="Basket of fresh bread and bakery products"
                    fill
                    sizes="(max-width: 640px) 350px, (max-width: 1024px) 450px, 600px"
                    priority
                    className={`object-contain ${imageScaleClass}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the dialog form */}
      {DialogForm}
    </section>
  );
};

export default BakeryHero;
