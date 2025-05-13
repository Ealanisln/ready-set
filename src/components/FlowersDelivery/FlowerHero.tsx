"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import ScheduleDialog from '../Logistics/Schedule';

interface FlowerHeroProps {
  headline?: string;
  subheadline?: string;
  imagePath?: string;
}

const FlowerHero: React.FC<FlowerHeroProps> = ({
  imagePath = "/images/flowers/flower1.png"
}) => {
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
    "We started in 2019 in the Bay Area, focusing on reliable, thoughtful catering deliveries.",
    "During the pandemic, we partnered with local flower shops to help bring joy and connection to communities.",
    "Today, we specialize in local floral deliveries across cities like San Francisco, Atlanta, and Austin, with real-time tracking and careful handling to ensure your blooms arrive on time and reflect your shop's reputation."
  ];
  
  return (
    <section className="w-full bg-gradient-to-br from-white via-white to-yellow-50 flex items-start md:items-center justify-center min-h-[100dvh] md:min-h-screen sm:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-10 lg:gap-16">
            {/* Text Content */}
            <div className="w-full md:w-5/12 mb-2 md:mb-0">
              <div 
                className={`transition-all duration-700 ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 leading-tight tracking-tight mb-3 md:mb-8">
                  <span className="block text-gray-900">Not Just Flowers—</span>
                  <span className="block text-gray-800">We Carry Your</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500">Standards.</span>
                </h1>
              </div>
              
              <div className="space-y-2 md:space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={`text-gray-700 text-sm md:text-base leading-relaxed font-medium transition-all duration-700 delay-${200 + (index * 100)} ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div 
                className={`flex flex-wrap gap-3 md:gap-5 mt-4 md:mt-10 transition-all duration-700 delay-700 ease-in-out ${isTextAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              >
                <button
                  onClick={handleQuoteClick}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-800 font-medium py-2.5 md:py-3 px-6 md:px-8 sm:px-10 rounded-md transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get a Quote
                </button>
                <ScheduleDialog
                  buttonText="Book a call"
                  calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                  customButton={
                    <button className="border border-yellow-500 text-yellow-600 font-medium py-2.5 md:py-3 px-6 md:px-8 sm:px-10 rounded-md transition-all duration-300 text-base hover:bg-yellow-50 shadow-sm hover:shadow-md">
                      Book a call
                    </button>
                  }
                />
              </div>
            </div>
            
            {/* Flower Image */}
            <div 
              className={`w-full md:w-7/12 flex items-center justify-center transition-all duration-1000 delay-300 ease-in-out ${isTextAnimated ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
            >
              <div className="relative w-full" style={{ 
                height: 'min(50vh, 600px)',
                maxHeight: '600px',
                minHeight: '300px'
              }}>
                <Image
                  src={imagePath}
                  alt="Colorful flower bouquet"
                  fill
                  priority
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="scale-110 md:scale-110 drop-shadow-2xl"
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