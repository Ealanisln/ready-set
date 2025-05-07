"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import type { CarouselApi } from '@/components/ui/carousel';

interface DeliveryStep {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
}

const DeliveryWork: React.FC = () => {
  const deliverySteps: DeliveryStep[] = [
    {
      id: '01',
      title: 'Order Intake and Updates',
      subtitle: 'Accepting and Updating Orders',
      points: [
        'Efficiently accepting orders, indicating any time sensitive and special instructions.',
        'Outside order matching and manually inputting orders that do not transmit automatically.',
        'Verification process for hospital and funeral home deliveries.',
        'Ensure same day orders with time sensitive deliveries are able to be made prior to acceptance.',
      ],
    },
    {
      id: '02',
      title: 'Communication',
      subtitle: 'Store Personnel, Drivers, and Customers',
      points: [
        'Constant communication with the flower shop personnel including but not limited to VIP orders, order updates, driver status & delivery complications.',
        'Slack is our preferred communication. A dedicated phone line is available for the flower shop will also be available for direct calls and text.',
        'Ongoing communication with drivers for procedural updates, scheduling cancellations, confirmations, delivery complications, and problem resolutions.',
        'Nightly reporting on deliveries including attempts, returns, and route completion times.',
      ],
    },
    {
      id: '03',
      title: 'Routing',
      subtitle: 'Create, Modify and Preset Routes',
      points: [
        'Building routes for AM and PM pick-ups with priority delivery requests.',
        'Modifying routes on what the store/manager is requesting.',
        'Preparing preset routes for next day.',
        'Checking all the AM/PM orders to see if there are any time details needed to be added on AM or PM routes.',
        'Pending order monitoring for orders to be added or pushed to the next day deliveries.',
      ],
    },
    {
      id: '04',
      title: 'Monitoring',
      subtitle: 'ETAs, Proof of Delivery, Photo & GPS Confirmations',
      points: [
        'Orders delivered at the right location and at the right time.',
        'Nightly checklist that includes a report of the daily deliveries.',
        'Photo confirmation for every delivery.',
        'Any undeliverable products will be put into pending queue or will be routed for re-delivery the next day.',
      ],
    },
    {
      id: '05',
      title: 'Quality Checks',
      subtitle: 'Reviewing Pictures, and Timestamps',
      points: [
        'We ensure everything is picked up and delivered daily at specified times.',
        'Special VIP and funeral orders are prioritized and placed on AM or PM routes accordingly.',
        'Monitoring timestamps of delivery and verifying undelivered products are returned or redelivered the next day.',
        'Daily picture review for quality of flowers at time of delivery.',
      ],
    },
    {
      id: '06',
      title: 'Confirmations',
      subtitle: 'Maintenance of Multiple Platforms',
      points: [
        'Confirming and matching orders on all platforms after completion of routes.',
        'Updating deliveries with time stamps and following up with the drivers for photo proof when needed.',
        'Priority monitoring of orders that need to be redelivered the next day.',
      ],
    },
    {
      id: '07',
      title: 'Problem Resolution',
      subtitle: 'Canned Messages and Responses',
      points: [
        'Responding to emails and platforms with canned responses.',
        'Escalation of unresolved issues to supervisors or managers.',
        'Continuous monitoring of outstanding issues until resolved.',
        'Inbound and outbound voice call and text options available for status updates.',
      ],
    },
  ];

  const [api, setApi] = useState<CarouselApi | undefined>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: CarouselApi | undefined) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
    const handler = () => onSelect(api);
    api.on('select', handler);
    const currentApi = api;
    return () => {
      currentApi.off('select', handler);
    };
  }, [api, onSelect]);

  return (
    <section className="bg-[#fdfcf7] py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-16 text-center text-4xl font-semibold text-[#222]">
          Service We Can <br /> Provide
        </h2>
        <div className="relative">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {deliverySteps.map((step) => (
                <CarouselItem key={step.id} className="basis-full px-2 md:basis-1/2 lg:basis-1/3">
                  <div className="grid h-full min-h-[370px] grid-rows-[auto,1fr] items-start rounded-xl border border-[#f1ede4] bg-[#fcf8ee] px-8 py-10 shadow-md">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#444] text-lg font-semibold text-white">
                        {step.id}
                      </div>
                      <h3 className="text-center text-2xl font-semibold text-[#222]">
                        {step.title}
                      </h3>
                      <div className="mb-2 mt-1 text-center text-[1.1rem] font-medium italic text-[#e2b13c]">
                        {step.subtitle}
                      </div>
                    </div>
                    <ul className="mt-0 list-disc space-y-1 pl-5 text-left text-sm text-[#444]">
                      {step.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center mt-8 gap-4 items-center">
            {/* Botón Flecha Izquierda */}
            <button
              className="text-7xl font-extrabold text-[#222] px-4 hover:text-[#e2b13c] transition-colors disabled:opacity-40"
              onClick={() => api?.scrollPrev()}
              aria-label="Anterior"
              disabled={selectedIndex === 0}
              type="button"
            >
              &#60;
            </button>
            {/* Puntos de navegación */}
            <div className="flex gap-5">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                    ${selectedIndex === idx ? 'bg-[#222] border-[#222]' : 'bg-transparent border-[#222]'}`}
                  onClick={() => api?.scrollTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                >
                  <span className={`block w-4 h-4 rounded-full ${selectedIndex === idx ? 'bg-[#222]' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
            {/* Botón Flecha Derecha */}
            <button
              className="text-7xl font-extrabold text-[#222] px-4 hover:text-[#e2b13c] transition-colors disabled:opacity-40"
              onClick={() => api?.scrollNext()}
              aria-label="Siguiente"
              disabled={selectedIndex === scrollSnaps.length - 1}
              type="button"
            >
              &#62;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryWork;
