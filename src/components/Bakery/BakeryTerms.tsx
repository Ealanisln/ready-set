'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface BakeryTermsProps {
  onRequestQuote?: (formType: FormType) => void;
}

const BakeryTerms = ({ onRequestQuote }: BakeryTermsProps) => {
  const { openForm, DialogForm } = FormManager();

  const handleQuoteClick = () => {
    openForm('bakery');
  };

  return (
    <div className="relative">
      {/* Background container with image */}
      <div className="relative">
        <Image
          src="/images/bakery/bakerybg2.png"
          alt="Food dishes"
          width={1200}
          height={800}
          className="h-[800px] w-full object-cover"
          priority
        />

        {/* Content container - separate positioning for mobile vs desktop */}
        {/* MODIFICACIÓN AQUÍ: Cambiado 'justify-start' a 'justify-center' para móviles */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-8 pt-16 md:justify-center md:py-8">
          {/* Dark container */}
          <div className="mb-3 w-full max-w-4xl rounded-2xl bg-gray-900 p-4 text-center md:mb-6 md:p-10">
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
            <ul className="list-disc space-y-4 pl-5">
              <li className="text-sm leading-snug md:text-base md:leading-normal">
                Pricing is based on a Maximum order of 10 packages per route.
              </li>
              <li className="text-sm leading-snug md:text-base md:leading-normal">
                Fees are based on the delivery zone; packages may have multiple zones in a route.
              </li>
              <li className="text-sm leading-snug md:text-base md:leading-normal">
                Toll will be charged regardless of the direction of the bridges crossed. Only 1 toll
                charged per route.
              </li>
              <li className="text-sm leading-snug md:text-base md:leading-normal">
                The default terms are to be paid on a net 7; this may vary based on volume and
                mutual agreement.
              </li>
              <li className="text-sm leading-snug md:text-base md:leading-normal">
                Late payments are the greater of 3.5% of the invoice or $25 per month after 30 days.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Render the dialog form */}
      {DialogForm}
    </div>
  );
};

export default BakeryTerms;
