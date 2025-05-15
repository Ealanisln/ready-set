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
      { name: 'Deli', logo: '/images/food/partners/deli.jpg' },
      { name: 'Bobcha', logo: '/images/food/partners/bobcha.jpg' },
      { name: 'Foodee', logo: '/images/food/partners/foodee.jpg' },
      { name: 'Destino', logo: '/images/food/partners/destino.png' },
      { name: 'Conviva', logo: '/images/food/partners/conviva.png' },
      { name: 'Kasa Indian Eatery', logo: '/images/food/partners/kasa.png' },
      { name: 'CaterValley', logo: '/images/food/partners/catervalley.png' },
      // Add any additional partners here
    ],
    [],
  );

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [topImageMargin, setTopImageMargin] = useState<string>('-40px');
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

      // Ajustar el margen superior basado en el ancho de la pantalla
      if (width < 640) {
        // Para móviles pequeños
        setTopImageMargin('-20px');
      } else if (width < 768) {
        // Para móviles más grandes
        setTopImageMargin('-30px');
      } else {
        // Para tablets y desktop
        setTopImageMargin('-40px');
      }
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

      {/* Content container para mejor posicionamiento */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between">
        {/* Top section with penguin logo - now positioned relative to the container */}
        <div
          className="relative mx-auto mt-8 w-full max-w-3xl px-4 md:mt-16 md:px-0"
          style={{ marginTop: topImageMargin }}
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

        {/* Spacer que empuja el carrusel hacia abajo en desktop pero menos en móvil */}
        <div className="flex-grow" />

        {/* Partners slider at bottom */}
        <div className="w-full pb-8 pt-4 md:pb-8 md:pt-0">
          <div className="mx-auto max-w-[90%] md:max-w-[80%]">
            <Carousel
              opts={{
                align: 'center',
                loop: true,
                dragFree: false,
                containScroll: false,
                slidesToScroll: 3,
              }}
              plugins={isClient ? [autoplayPlugin.current] : []}
              className="w-full"
            >
              <CarouselContent className="-ml-0 -mr-0">
                {partners.map((partner) => (
                  <CarouselItem key={partner.name} className="basis-1/3 pl-0 pr-0">
                    <div className="mx-1 md:mx-2">
                      <div className="relative h-20 w-full overflow-hidden rounded-2xl border-4 border-yellow-400 bg-white shadow-lg md:h-24">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain p-2"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartners;
