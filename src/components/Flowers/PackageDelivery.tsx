'use client';

import { useState } from 'react';
import Image from 'next/image';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';

interface PackageDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const PackageDelivery = ({ onRequestQuote }: PackageDeliveryProps) => {
  const handleQuoteClick = () => {
    if (onRequestQuote) {
      onRequestQuote('flower');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/flowers/flower3.jpg"
        alt="Tulips"
        width={1200}
        height={400}
        className="h-full w-full object-cover"
        priority
      />

      {/* Main Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {/* Empty space at top */}
        <div className="mb-auto"></div>

        {/* Title and Button Section - With transparent background */}
        <div className="mb-8 w-full max-w-4xl rounded-xl bg-black bg-opacity-20 p-8 text-center">
          <h2 className="mb-10 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
            Package Delivery Terms <br /> & Pricing Chart
          </h2>

          {/* Buttons Section - Now inside the transparent container */}
          <div className="flex justify-center gap-6">
            <button
              onClick={handleQuoteClick}
              className="rounded-lg bg-yellow-500 px-6 py-3 text-xl font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
            >
              Get a quote
            </button>
            <ScheduleDialog
              buttonText="Book a Call"
              className="rounded-lg bg-yellow-500 px-6 py-3 text-xl font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
              calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
            />
          </div>
        </div>

        {/* Terms Box */}
        <div className="mb-12 w-full max-w-4xl">
          <div className="rounded-xl bg-white bg-opacity-95 p-6 text-left text-gray-600 shadow-xl">
            <ul className="list-disc space-y-3 pl-6 text-base md:text-lg">
              <li>Pricing is based on a minimum order of 10 packages per route.</li>
              <li>
                If the order is less than 10 packages, an additional fee will apply based on the
                originating pick-up zone.
              </li>
              <li>Fees are based on delivery zone; packages may have multiple zones in a route.</li>
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
  );
};

export default PackageDelivery;
