'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface PackageDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const DeliveryTerms = ({ onRequestQuote }: PackageDeliveryProps) => {
  const { openForm, DialogForm } = FormManager();

  const handleQuoteClick = () => {
    openForm('food');
  };

  return (
    <div className="relative">
      {/* Background container with image */}
      <div className="relative">
        <Image
          src="/images/food/fooddeliverybg.png"
          alt="Food dishes"
          width={1200}
          height={800}
          className="h-[800px] w-full object-cover"
          priority
        />

        {/* Content container - separate positioning for mobile vs desktop */}
        <div className="absolute inset-0 flex flex-col items-center justify-start px-4 pb-8 pt-16 md:justify-center md:py-8">
          {/* Dark container */}
          <div className="mb-3 w-full max-w-4xl rounded-2xl bg-gray-800 p-4 text-center md:mb-6 md:p-10">
            <h2 className="mb-3 text-xl font-bold text-white md:mb-6 md:text-5xl">
              Package Delivery Terms <br /> & Pricing Chart
            </h2>
            <div className="flex flex-row items-center justify-center gap-3 md:gap-6">
              <button
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-6 md:py-3 md:text-lg"
                onClick={handleQuoteClick}
              >
                Get a Quote
              </button>
              <ScheduleDialog
                buttonText="Book a Call"
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-6 md:py-3 md:text-lg"
                calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
              />
            </div>
          </div>

          {/* White container - with responsive layout (1 column on mobile, 2 columns on desktop) */}
          <div className="w-full max-w-4xl rounded-xl bg-white p-4 text-left shadow-lg md:p-8">
            {/* Two-column layout that switches to single column on mobile */}
            <div className="flex flex-col md:flex-row">
              {/* Left column */}
              <div className="md:w-1/2 md:pr-8">
                <h2 className="mb-2 text-lg font-bold md:mb-4 md:text-xl">
                  Headcount vs Food Cost
                </h2>
                <ul className="mb-4 list-disc pl-5">
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    Delivery cost is based on the lesser, please make sure to update your order
                    sheet weekly by end of day Friday.
                  </li>
                </ul>

                <h2 className="mb-2 text-lg font-bold md:mb-4 md:text-xl">Mileage Rate</h2>
                <ul className="mb-4 list-disc pl-5">
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    $3.00 per mile after 10 miles
                  </li>
                </ul>

                <h2 className="mb-2 text-lg font-bold md:mb-4 md:text-xl">Daily Drive Discount</h2>
                <ul className="mb-4 list-disc pl-5 md:mb-0">
                  <li className="mb-1 text-sm leading-snug md:mb-2 md:text-base md:leading-normal">
                    2 Drives/Day-$5/drive
                  </li>
                  <li className="mb-1 text-sm leading-snug md:mb-2 md:text-base md:leading-normal">
                    3 Drives/Day-$10/drive
                  </li>
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    4 Drives/Day-$15/drive
                  </li>
                </ul>
              </div>

              {/* Right column */}
              <div className="md:w-1/2 md:pl-8">
                <ol className="list-decimal space-y-2 pl-5 md:space-y-4">
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    If the drive is batched together with the same driver, we only charge
                    tolls/mileage once for the total trip.
                  </li>
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    Hosting events requires advanced notice and is based on availability.
                  </li>
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    Default terms are to be paid on a NET 7; this can vary based on volume.
                  </li>
                  <li className="text-sm leading-snug md:text-base md:leading-normal">
                    Late payments are the greater amount to an interest rate of 2.5% of the invoice
                    or $25 per month after 30 days.
                  </li>
                </ol>
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

export default DeliveryTerms;
