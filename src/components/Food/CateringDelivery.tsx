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
  const [marginTopClass, setMarginTopClass] = useState('mt-0'); // Valor inicial sin margen
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
    openForm('food');
  };

  return (
    <section className={`relative min-h-[600px] w-full ${marginTopClass}`}>
      {' '}
      {/* Usamos el estado para la clase de margen */}
      {/* Background image - no opacity or bg-color to see if image loads */}
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
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-lg">
            {/* Yellow circular background with food bowl image */}
            <div className="relative mx-auto h-[300px] w-[300px] overflow-hidden rounded-full border-8 border-yellow-300 bg-yellow-300 md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/food/salad-bowl.png"
                  alt="Catering food bowl with fresh ingredients"
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 450px"
                  priority
                  className="scale-125" // Añadimos scale-125 para hacer la imagen un 25% más grande
                  style={{ objectFit: 'cover' }} // Cambiamos de 'contain' a 'cover'
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
