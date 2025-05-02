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

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
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
          Operating since <span className="font-bold text-yellow-400">2019</span>, Ready Set began
          in the Bay Area with a mission to serve local communities through reliable, thoughtful
          delivery.
        </p>
        <p className="mb-3 cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          When the pandemic hit, we quickly adapted, partnering with neighborhood flower shops to
          help keep joy and connection alive during challenging times.
        </p>
        <p className="cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          Today, we specialize in local floral delivery with a personal touch. From San Francisco to
          Atlanta and Austin, our dedicated drivers ensure your blooms arrive on time, every time.
          Each route is monitored in real-time and handled carefully, because we know it's more than
          just flowers. It's your shop's reputation in every bouquet.
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
      <div className="flex w-full items-center justify-center overflow-visible md:justify-end">
        <FlowerImage />
      </div>
    </section>
  );
};

export default FlowerHero;
