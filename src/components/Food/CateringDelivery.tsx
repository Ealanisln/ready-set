'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ScheduleDialog from '../Logistics/Schedule';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface CateringDeliveryProps {
  onRequestQuote?: () => void;
}

const CateringDelivery: React.FC<CateringDeliveryProps> = ({ onRequestQuote }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { openForm, DialogForm } = FormManager();

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
    console.log('CateringHero - Get a quote clicked');
    openForm('food');
  };

  return (
    <section className="relative w-full bg-white">
      {/* Background image - positioned absolutely to cover the section */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src="/images/food/truckbg.png"
          alt="Delivery truck background"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-12 md:flex-row md:items-center md:py-16 lg:py-20">
        {/* Left content - Text */}
        <div className="relative z-10 w-full max-w-xl space-y-6 px-4 md:w-1/2 md:px-6 lg:px-8">
          <h1 className="font-[Montserrat] text-2xl font-black leading-tight text-gray-800 md:text-3xl lg:text-4xl">
            Your Go-To Catering
            <br />
            Delivery Partner Since
            <br />
            <span className="text-2xl text-yellow-400 md:text-3xl lg:text-4xl">2019</span>
          </h1>

          <p className="font-[Montserrat] text-sm leading-relaxed text-gray-900 md:text-base">
            Ready Set HQ, based in the San Francisco Bay Area, is expanding to Atlanta and Austin.
            We deliver daily team lunches, corporate events, and special occasions, trusted by top
            tech companies like Apple, Google, Facebook, and Netflix for our reliable catering
            delivery service.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleQuoteClick}
              className="rounded-full bg-yellow-300 px-8 py-3 font-[Montserrat] font-bold text-gray-800 transition-colors hover:bg-yellow-400"
            >
              Get a Quote
            </button>
            <ScheduleDialog
              buttonText="Book a Call"
              calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
              className="rounded-full bg-yellow-300 px-8 py-3 font-[Montserrat] font-bold text-gray-800 transition-colors hover:bg-yellow-400"
            />
          </div>
        </div>

        {/* Right content - Image */}
        <div className="mt-8 flex w-full items-center justify-center md:mt-0 md:w-1/2 md:justify-end">
          <div className="relative">
            {/* Yellow circular background with food bowl image */}
            <div className="relative h-[450px] w-[450px] overflow-hidden rounded-full border-8 border-yellow-300 bg-yellow-300 md:h-[550px] md:w-[550px] lg:h-[600px] lg:w-[600px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/food/salad-bowl.png"
                  alt="Catering food bowl with fresh ingredients"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                  className="translate-x-5 scale-110"
                  style={{ objectFit: 'contain' }}
                />
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

export default CateringDelivery;
