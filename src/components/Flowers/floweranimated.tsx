// components/FlowerHero.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import DialogFormContainer from '@/components/Logistics/DialogFormContainer';
import ScheduleDialog from '../Logistics/Schedule';

const FlowerHero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="relative flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-4 py-12 md:grid md:grid-cols-2 md:items-center md:py-16 lg:py-20">
      {/* Left content - Text */}
      <div className="relative z-10 flex w-full max-w-xl flex-col space-y-6 px-6 md:px-10 lg:px-14 xl:px-20">
        <h1 className="mb-6 cursor-pointer font-[Montserrat] text-2xl font-black leading-tight text-gray-800 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-3xl lg:text-4xl">
          Not Just Flowers—
          <br />
          We Carry Your Standards.
        </h1>

        <p className="mb-3 cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          Operating since <span className="font-bold text-yellow-400">2019</span>, Ready Set began
          in the Bay Area with a mission to serve local communities through reliable, thoughtful
          delivery.
        </p>
        <p className="mb-3 cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          When the world changed, we adapted—partnering with neighborhood flower shops to keep joy
          and connection alive. Today, we specialize in local floral delivery with a personal touch.
        </p>
        <p className="cursor-pointer font-[Montserrat] text-sm text-gray-900 transition-all duration-300 ease-in-out hover:scale-105 hover:text-yellow-500 md:text-base lg:text-lg">
          From San Francisco to Atlanta and Austin, our dedicated drivers ensure your blooms arrive
          on time, every time. Each route is monitored in real-time and handled with care—because we
          know it's more than just flowers. It's your shop's reputation in every bouquet.
        </p>

        <div className="flex flex-row flex-nowrap items-center gap-4 pt-4">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex min-w-[120px] items-center justify-center rounded-full bg-yellow-400 px-6 py-3 font-[Montserrat] text-base font-bold text-[#23272E] shadow-sm transition-colors hover:bg-yellow-500"
          >
            <span className="font-bold">Get a quote</span>
          </button>
          <ScheduleDialog
            buttonText="Book a call"
            calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
          />
        </div>

        <DialogFormContainer
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          formType="flower"
          onSubmit={async () => setIsDialogOpen(false)}
        />
      </div>

      {/* Right content - Image */}

      <div className="flex w-full items-center justify-end overflow-visible">
        <div className="relative h-80 w-80 md:h-96 md:w-96">
          <Image 
            src="/images/flowers/bouquet.jpg"
            alt="Flower bouquet" 
            className="rounded-lg object-cover"
            fill
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default FlowerHero;
