'use client';

import Image from 'next/image';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Partner {
  name: string;
  logo: string;
}

const DeliveryPartners: React.FC = () => {
  const partners: Partner[] = useMemo(
    () => [
      { name: 'Foodee', logo: '/images/food/partners/foodee.jpg' },
      { name: 'Destino', logo: '/images/food/partners/destino.png' },
      { name: 'Conviva', logo: '/images/food/partners/conviva.png' },
      { name: 'Kasa Indian Eatery', logo: '/images/food/partners/kasa.png' },
      { name: 'CaterValley', logo: '/images/food/partners/catervalley.png' },
      { name: 'Deli', logo: '/images/food/partners/deli.jpg' },
      { name: 'Bobcha', logo: '/images/food/partners/bobcha.jpg' },
      // Add any additional partners here
    ],
    [],
  );

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Image with flowers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/food/deliverypartnersbg.png"
          alt="Flower shop background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-100 saturate-150"
        />
      </div>

      {/* Image moved higher with negative margin-top */}
      <div
        className="absolute left-0 right-0 top-0 z-30 mx-auto w-full max-w-3xl px-4 md:px-0"
        style={{ marginTop: '-40px' }}
      >
        <Image
          src="/images/food/partners/deliverysupport.png"
          alt="Delivery Support"
          width={800}
          height={400}
          className="w-full rounded-xl shadow-xl"
          priority
        />
      </div>

      {/* Partners slider at bottom */}
      <div className="absolute bottom-0 left-0 z-10 w-full pb-8">
        <div className="relative w-full">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              dragFree: false,
              slidesToScroll: 1,
            }}
            plugins={isClient ? [autoplayPlugin.current] : []} // Only apply plugins on the client
            className="w-full px-4 md:px-10"
          >
            <CarouselContent className="!pl-0">
              {partners.map((partner) => (
                <CarouselItem
                  key={partner.name}
                  className={`${isMobile ? 'basis-1/3' : 'basis-1/4'} !pl-2 pr-2`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-2xl border-4 border-yellow-400 bg-white shadow-lg">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartners;
