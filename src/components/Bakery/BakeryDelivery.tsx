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
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left content - Text */}
          <div className="relative z-10 w-full max-w-xl space-y-6 px-4 md:w-1/2 md:px-0">
            <h1 className="font-[Montserrat] text-3xl font-black leading-tight text-gray-800 md:text-4xl lg:text-5xl">
              Your Go-To Delivery
              <br />
              Partner Since
              <br />
              <span className="text-yellow-400">2019</span>
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
          <div className="relative mt-8 md:mt-0 md:w-1/2">
            <div className="relative flex justify-center md:justify-end">
              {/* Yellow circular background - made larger */}
              <div className="absolute right-0 h-[550px] w-[550px] rounded-full bg-yellow-300" />

              {/* Bread basket image positioned on top of yellow circle - increased size and scale */}
              <div className="relative z-10 h-[650px] w-[650px] overflow-visible">
                <Image
                  src="/images/bakery/breadbasket.png"
                  alt="Basket of fresh bread and bakery products"
                  fill
                  sizes="(max-width: 768px) 100vw, 650px"
                  priority
                  className="object-contain"
                  style={{
                    objectPosition: 'center',
                    transform: 'scale(1.5)', // Increased scale from 1.3 to 1.5
                  }}
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
