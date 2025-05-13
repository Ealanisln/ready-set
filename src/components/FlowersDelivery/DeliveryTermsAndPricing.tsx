'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScheduleDialog from '@/components/Logistics/Schedule';
import { FormType } from '@/components/Logistics/QuoteRequest/types';

interface PackageDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const DeliveryTermsAndPricing = ({ onRequestQuote }: PackageDeliveryProps) => {
  const handleQuoteClick = () => {
    if (onRequestQuote) {
      onRequestQuote('flower');
    }
  };

  return (
    // Remove width constraints and overflow-hidden from this container
    <div className="relative">
      {/* Make the image container full width */}
      <div className="relative h-full w-full">
        <Image
          src="/images/flowers/flower3.jpg"
          alt="Tulips"
          width={1200}
          height={400}
          // Use object-cover and make sure the image fills the container
          className="h-full min-h-[720px] w-screen object-cover md:min-h-0"
          // Add this to remove any constraints on the image
          style={{ maxWidth: '100vw' }}
        />

        {/* Keep overlay centered */}
        <div className="absolute left-0 right-0 top-[15%] z-10 flex w-full justify-center px-4 md:left-1/2 md:top-[35%] md:-translate-x-1/2 md:-translate-y-1/2 md:px-0">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-2xl bg-gray-900 bg-opacity-20 p-4 text-center shadow-2xl md:p-12">
            <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-4xl">
              Package Delivery Terms <br /> & Pricing Chart
            </h2>
            <div className="flex w-full flex-row items-center justify-center gap-4 md:gap-8">
              <button
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-5 md:text-lg"
                onClick={handleQuoteClick}
              >
                Get a quote
              </button>
              <ScheduleDialog
                buttonText="Book a Call"
                calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                customButton={
                  <button className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-5 md:text-lg">
                    Book a Call
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* White info box */}
        <div
          className="absolute bottom-[80px] left-0 right-0 flex w-full justify-center px-4 md:bottom-[40px] md:pb-6"
          style={{ zIndex: 20 }}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white bg-opacity-95 px-4 py-4 text-left text-xs text-gray-900 shadow md:px-6 md:py-4 md:text-sm"
            style={{ lineHeight: 1.4 }}
          >
            <ul className="list-disc pl-5">
              <li className="mb-1">
                Pricing is based on a minimum order of 10 packages per route.
              </li>
              <li className="mb-1">
                If the order is less than 10 packages, an additional fee will apply based on the
                originating pick-up zone.
              </li>
              <li className="mb-1">
                Fees are based on delivery zone; packages may have multiple zones in a route.
              </li>
              <li className="mb-1">
                Toll will be charged regardless of the direction of the bridges crossed. Only 1 toll
                charged per route.
              </li>
              <li className="mb-1">
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

export default DeliveryTermsAndPricing; 


