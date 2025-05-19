'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ScheduleDialog from '../Logistics/Schedule';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface BakeryDeliveryProps {
  onRequestQuote?: () => void;
}

const BakeryDelivery: React.FC<BakeryDeliveryProps> = ({ onRequestQuote }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [marginTopClass, setMarginTopClass] = useState('mt-0');
  const { openForm, DialogForm } = FormManager();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      updateMarginTopClass(window.innerWidth);
    };

    const updateMarginTopClass = (width: number) => {
      if (width < 768) {
        setMarginTopClass('mt-16');
      } else if (width < 1024) {
        setMarginTopClass('mt-20');
      } else {
        setMarginTopClass('mt-24');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleQuoteClick = () => {
    console.log('CateringHero - Get a quote clicked');
    openForm('bakery');
  };

  return (
    <section className={`relative min-h-[600px] w-full ${marginTopClass}`}>
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
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-12 md:flex-row md:items-center md:py-16 lg:py-20">
        {/* Left content - Text */}
        <div className="relative z-10 w-full max-w-xl space-y-6 px-4 md:w-1/2 md:px-0">
          <h1 className="font-[Montserrat] text-3xl font-black leading-tight text-gray-800 md:text-4xl lg:text-5xl">
            Your Go-To Delivery
            <br />
            Partner Since
            <br />
            <span className="text-3xl text-yellow-400 md:text-4xl lg:text-5xl">2019</span>
          </h1>

          <p className="font-[Montserrat] text-sm leading-relaxed text-gray-900 md:text-base lg:pr-8">
            Ready Set HQ, based in the San Francisco Bay Area, is expanding to Atlanta and Austin.
            We deliver daily team lunches, corporate events, and special occasions, trusted by top
            tech companies like Apple, Google, Facebook, and Netflix for our reliable catering
            delivery service. And we're not just about catering—we now deliver for local bakeries
            too!
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
        <div className="relative mt-8 flex w-full items-center justify-center md:mt-0 md:w-1/2 md:justify-end">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl">
            {/* Yellow circular background with bread basket image */}
            <div className="relative mx-auto h-[350px] w-[350px] overflow-hidden rounded-full border-8 border-yellow-300 bg-yellow-300 md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/bakery/breadbasket.png"
                  alt="Basket of fresh bread and bakery products"
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 500px"
                  priority
                  className="scale-150 object-contain"
                  style={{ objectPosition: 'center' }}
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

export default BakeryDelivery;
