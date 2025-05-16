'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import ScheduleDialog from '../Logistics/Schedule';

interface FlowerHeroProps {
  headline?: string;
  subheadline?: string;
  imagePath?: string;
}

const FlowerHero: React.FC<FlowerHeroProps> = ({ imagePath = '/images/flowers/flower1.png' }) => {
  const [isTextAnimated, setIsTextAnimated] = useState(false);
  // Initialize the FormManager
  const { openForm, DialogForm } = FormManager();

  useEffect(() => {
    // Trigger text animation when component mounts
    setIsTextAnimated(true);
  }, []);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('flower');
  };

  // Split subheadline into paragraphs for better readability
  const paragraphs = [
    'We started in 2019 in the Bay Area, focusing on reliable, thoughtful catering deliveries.',
    'During the pandemic, we partnered with local flower shops to help bring joy and connection to communities.',
    "Today, we specialize in local floral deliveries across cities like San Francisco, Atlanta, and Austin, with real-time tracking and careful handling to ensure your blooms arrive on time and reflect your shop's reputation.",
  ];

  return (
    <section className="mt-24 flex min-h-[100dvh] w-full items-start justify-center bg-gradient-to-br from-white via-white to-yellow-50 sm:mt-32 md:mt-16 md:min-h-screen md:items-center">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-8 md:py-0 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-center md:gap-10 lg:gap-16">
            {/* Text Content */}
            <div className="mb-2 w-full text-center md:mb-0 md:w-5/12 md:text-left">
              <div
                className={`transition-all duration-700 ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-gray-800 sm:text-5xl md:mb-8">
                  <span className="block text-gray-900">Not Just Flowers—</span>
                  <span className="block text-gray-800">We Carry Your</span>
                  <span className="block bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                    Standards.
                  </span>
                </h1>
              </div>

              <div className="space-y-2 md:space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-sm font-medium leading-relaxed text-gray-700 transition-all duration-700 md:text-base delay-${200 + index * 100} ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* CTA Buttons */}
              <div
                className={`mt-4 flex flex-wrap gap-3 transition-all delay-700 duration-700 ease-in-out md:mt-10 md:gap-5 ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <button
                  onClick={handleQuoteClick}
                  className="transform rounded-md bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-2.5 text-base font-medium text-gray-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-yellow-600 hover:to-yellow-500 hover:shadow-xl sm:px-10 md:px-8 md:py-3"
                >
                  Get a Quote
                </button>
                <ScheduleDialog
                  buttonText="Book a call"
                  calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                  customButton={
                    <button className="rounded-md border border-yellow-500 px-6 py-2.5 text-base font-medium text-yellow-600 shadow-sm transition-all duration-300 hover:bg-yellow-50 hover:shadow-md sm:px-10 md:px-8 md:py-3">
                      Book a call
                    </button>
                  }
                />
              </div>
            </div>

            {/* Flower Image - Modificado para hacer la imagen más grande y centrada */}
            <div
              className={`mb-4 mt-8 flex w-full items-center justify-center transition-all delay-300 duration-1000 ease-in-out sm:mb-8 sm:mt-12 md:mb-0 md:mt-0 md:w-7/12 ${isTextAnimated ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
            >
              <div
                className="relative mx-auto w-full"
                style={{
                  height: 'min(60vh, 650px)', // Ajustado para mejor proporción
                  maxHeight: '700px',
                  minHeight: '350px',
                  maxWidth: '100%',
                }}
              >
                <Image
                  src={imagePath}
                  alt="Colorful flower bouquet"
                  fill
                  priority
                  style={{ objectFit: 'contain', objectPosition: 'center center' }}
                  sizes="(max-width: 768px) 90vw, 58vw"
                  className="md:scale-130 scale-110 drop-shadow-2xl sm:scale-125" // Ajuste de escala para dispositivos móviles
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

export default FlowerHero;
