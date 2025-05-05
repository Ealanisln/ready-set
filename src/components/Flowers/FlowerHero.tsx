'use client';

import Image from 'next/image';
import Link from 'next/link';
import FlowerImage from './FlowerImage';
import { useState, useEffect } from 'react';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';

interface FlowerHeroProps {
  onRequestQuote: (formType: FormType) => void;
}

const FlowerHero = ({ onRequestQuote }: FlowerHeroProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [translateClass, setTranslateClass] = useState('');

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // Set the translate class based on window width
      if (width < 768) {
        setTranslateClass('');
      } else if (width >= 768 && width < 1024) {
        setTranslateClass('-translate-x-20');
      } else {
        setTranslateClass('-translate-x-40');
      }
    };

    // Initial check
    updateDimensions();

    // Add event listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleQuoteClick = () => {
    console.log('FlowerHero - Get a quote clicked');
    onRequestQuote('flower');
  };

  return (
    <section className="relative flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-4 py-12 md:grid md:grid-cols-2 md:items-center md:py-16 lg:py-20">
      {/* Left content - Text */}
      <div className="relative z-10 flex w-full max-w-xl flex-col space-y-6 px-6 md:px-10 lg:px-14 xl:px-20">
        <h1 className="mb-6 cursor-pointer font-[Montserrat] text-2xl font-black leading-tight text-gray-800 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-3xl lg:text-4xl">
          Not Just Flowers—
          <br />
          We Carry Your Standards.
        </h1>

        <p className="mb-3 cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          We started in <span className="font-bold text-yellow-400">2019</span> in the Bay Area,
          focusing on reliable, thoughtful catering deliveries. During the pandemic, we partnered
          with local flower shops to help bring joy and connection to communities. Today, we
          specialize in local floral deliveries across cities like San Francisco, Atlanta, and
          Austin, with real-time tracking and careful handling to ensure your blooms arrive on time
          and reflect your shop's reputation.
        </p>

        <div className="flex flex-row flex-nowrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleQuoteClick}
            className="flex min-w-[120px] items-center justify-center rounded-full bg-yellow-400 px-6 py-3 font-[Montserrat] text-base font-bold text-[#23272E] shadow-sm transition-colors hover:bg-yellow-500"
          >
            <span className="font-bold">Get a quote</span>
          </button>
          <ScheduleDialog
            buttonText="Book a call"
            calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
            className="flex min-w-[120px] items-center justify-center rounded-full bg-yellow-400 px-6 py-3 font-[Montserrat] text-base font-bold text-[#23272E] shadow-sm transition-colors hover:bg-yellow-500"
          />
        </div>
      </div>

      {/* Right content - Image */}
      <div
        className={`flex w-full overflow-visible md:items-center md:justify-end ${translateClass}`}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <FlowerImage />
      </div>
    </section>
  );
};

export default FlowerHero;
