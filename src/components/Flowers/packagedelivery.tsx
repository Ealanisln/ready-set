'use client';

import { useState } from 'react';
import Image from 'next/image';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface PackageDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const PackageDelivery = ({ onRequestQuote }: PackageDeliveryProps) => {
  // Initialize the FormManager
  const { openForm, DialogForm } = FormManager();

  const handleQuoteClick = () => {
    // Open the flower form directly
    openForm('flower');
    if (onRequestQuote) {
      onRequestQuote('flower');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Full-width container with background image and content */}
      <div className="relative w-full">
        {/* Background flower image that fills the entire width and has more height */}
        <div className="relative w-full h-[85vh] min-h-[800px]">
          <Image
            src="/images/flowers/flower3.png"
            alt="Tulips"
            fill
            className="object-cover object-center"
            priority
          />
          
          {/* Content overlaying the image */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
            {/* Card-like container for title and buttons */}
            <div className="relative w-full max-w-3xl">
              {/* Semi-transparent gray overlay with rounded corners for the title and buttons */}
              <div className="absolute inset-0 rounded-3xl bg-gray-800 bg-opacity-40 backdrop-blur-sm"></div>
              
              <div className="relative z-10 px-8 py-12 flex flex-col items-center">
                {/* Title */}
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
                    Package Delivery Terms
                    <br />
                    & Pricing Chart
                  </h2>
                </div>
                
                {/* Buttons */}
                <div className="flex flex-row gap-8">
                  <button
                    className="rounded-lg bg-yellow-500 px-8 py-3 text-lg font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                    onClick={handleQuoteClick}
                  >
                    Get a Quote
                  </button>
                  <ScheduleDialog
                    buttonText="Book a Call"
                    calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                    customButton={
                      <button className="rounded-lg bg-yellow-500 px-8 py-3 text-lg font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2">
                        Book a Call
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
            
            {/* Info box outside the gray area */}
            <div className="w-full max-w-3xl mt-12 z-30 px-4">
              <div className="rounded-xl bg-white bg-opacity-95 px-6 py-6 text-left shadow-lg">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Pricing is based on a minimum order of 10 packages per route.
                  </li>
                  <li>
                    If the order is less than 10 packages, an additional fee will apply based on the
                    originating pick-up zone.
                  </li>
                  <li>
                    Fees are based on delivery zone; packages may have multiple zones in a route.
                  </li>
                  <li>
                    Toll will be charged regardless of the direction of the bridges crossed. Only 1 toll
                    charged per route.
                  </li>
                  <li>
                    Default terms are to be paid on a net 7; this may vary based on volume and mutual
                    agreement.
                  </li>
                  <li>
                    Late payments are the greater amount of 3.5% of the invoice or $25 per month after
                    30 days.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Render the dialog form */}
      {DialogForm}
    </div>
  );
};

export default PackageDelivery;
