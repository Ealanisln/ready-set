'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AppointmentDialog from '../VirtualAssistant/Appointment';

const PackageDelivery = ({ onRequestQuote }: { onRequestQuote?: (formType: string) => void }) => {
  const handleQuoteClick = () => {
    if (onRequestQuote) {
      onRequestQuote('flower');
    }
  };
  return (
    <div className="relative w-full overflow-hidden rounded-md shadow-md">
      <div className="relative">
        <Image
          src="/images/flowers/flower3.jpg"
          alt="Tulips"
          width={1200}
          height={400}
          className="h-full w-full object-cover"
        />

        {/* Transparent overlay with title and buttons only, moved up */}
        <div
          className="absolute left-1/2"
          style={{ top: '38%', transform: 'translate(-50%, -50%)', width: '90%' }}
        >
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-2xl bg-gray-900 bg-opacity-20 p-8 text-center shadow-2xl md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
              Package Delivery Terms <br /> & Pricing Chart
            </h2>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
              <button
                className="rounded-lg bg-yellow-500 px-6 py-3 text-base font-bold text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 md:text-lg"
                onClick={handleQuoteClick}
              >
                Get a quote
              </button>
              <AppointmentDialog
                buttonText="Book a Call"
                buttonVariant="custom"
                buttonClassName="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 text-base md:text-lg rounded-lg shadow-lg font-bold flex items-center justify-center"
                calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
              />
            </div>
          </div>
        </div>
        {/* White info box OUTSIDE the overlay, mismo ancho que el overlay superior */}
        <div
          className="flex w-full justify-center"
          style={{ position: 'absolute', left: 0, right: 0, bottom: '7%', zIndex: 20 }}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white bg-opacity-95 px-3 py-2 text-left text-xs text-gray-900 shadow md:px-6 md:py-3 md:text-sm"
            style={{ lineHeight: 1.3 }}
          >
            <ul className="list-disc pl-4">
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
