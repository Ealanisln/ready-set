'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScheduleDialog from '../Logistics/Schedule';
import { FormType } from '../Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager'; // Import FormManager

interface PackageDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const DeliveryTerms = ({ onRequestQuote }: PackageDeliveryProps) => {
  // Initialize the FormManager to get openForm and DialogForm
  const { openForm, DialogForm } = FormManager();

  const handleQuoteClick = () => {
    openForm('food');
  };

  return (
    // Remove width constraints and overflow-hidden from this container
    <div className="relative">
      {/* Make the image container full width */}
      <div className="relative h-full w-full">
        <Image
          src="/images/food/fooddeliverybg.png"
          alt="Food dishes"
          width={1200}
          height={400}
          // Use object-cover and make sure the image fills the container
          className="h-full min-h-[720px] w-screen object-cover md:min-h-0"
          // Add this to remove any constraints on the image
          style={{ objectFit: 'cover' }}
        />

        {/* UPDATED: Dark container positioning and width to match white container */}
        <div className="absolute left-0 right-0 top-[5%] z-10 flex w-full justify-center px-4 md:left-1/2 md:top-[20%] md:-translate-x-1/2 md:-translate-y-1/2 md:px-0">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center rounded-2xl bg-gray-800 p-8 text-center shadow-2xl md:p-16">
            <h2 className="mb-8 text-4xl font-bold text-white md:mb-10 md:text-5xl">
              Package Delivery Terms <br /> & Pricing Chart
            </h2>
            <div className="flex w-full flex-row items-center justify-center gap-8 md:gap-12">
              <button
                className="rounded-lg bg-yellow-500 px-6 py-3 text-lg font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-10 md:py-4 md:text-xl"
                onClick={handleQuoteClick}
              >
                Get a Quote
              </button>
              <ScheduleDialog
                buttonText="Book a Call"
                className="rounded-lg bg-yellow-500 px-6 py-3 text-lg font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:px-10 md:py-4 md:text-xl"
                calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
              />
            </div>
          </div>
        </div>

        {/* UPDATED: White info box positioned further down from the dark container */}
        <div
          className="absolute left-0 right-0 top-[400px] mt-8 flex w-full justify-center px-4 md:top-[480px] md:pb-6"
          style={{ zIndex: 20 }}
        >
          <div
            className="w-full max-w-4xl rounded-xl bg-white bg-opacity-95 px-10 py-6 text-left shadow"
            style={{ lineHeight: 1.4 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left column */}
              <div className="flex-1 pr-0 md:pr-8">
                <h2 className="mb-4 text-2xl font-bold">Headcount vs Food Cost</h2>
                <ul className="mb-6 list-disc pl-5">
                  <li>
                    Delivery cost is based on the lesser, please make sure to update your order
                    sheet weekly by end of day Friday.
                  </li>
                </ul>

                <h2 className="mb-4 text-2xl font-bold">Mileage Rate</h2>
                <ul className="mb-6 list-disc pl-5">
                  <li>$3.00 per mile after 10 miles</li>
                </ul>

                <h2 className="mb-4 text-2xl font-bold">Daily Drive Discount</h2>
                <ul className="list-disc pl-5">
                  <li className="mb-2">2 Drives/Day-$5/drive</li>
                  <li className="mb-2">3 Drives/Day-$10/drive</li>
                  <li>4 Drives/Day-$15/drive</li>
                </ul>
              </div>

              {/* Right column */}
              <div className="mt-6 flex-1 pl-0 md:mt-0 md:pl-8">
                <ol className="ml-5 list-decimal space-y-6">
                  <li>
                    If the drive is batched together with the same driver, we only charge
                    tolls/mileage once for the total trip.
                  </li>
                  <li>Hosting events requires advanced notice and is based on availability.</li>
                  <li>Default terms are to be paid on a NET 7; this can vary based on volume.</li>
                  <li>
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
