'use client';

import Image from 'next/image';
import React, { useEffect, useState, useMemo } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ExpertSupportSection = () => {
  const partners = useMemo(() => [
    'FTD',
    'Bloom Link',
    'H Bloom',
    'Dove / Teleflora',
    'Lovingly',
    'Floom',
    'Bloom Nation',
    'Flower Shop Network',
  ], []);

  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1]>();

  useEffect(() => {
    if (!carouselApi) return;
    let currentIndex = 0;
    const repeatedPartners = Array(4).fill(partners).flat();
    const totalSlides = repeatedPartners.length;

    const interval = setInterval(() => {
      currentIndex = carouselApi.selectedScrollSnap() + 1;
      if (currentIndex >= totalSlides) {
        currentIndex = 0;
      }
      carouselApi.scrollTo(currentIndex);
    }, 6000); // 6 segundos
    return () => clearInterval(interval);
  }, [carouselApi, partners]);

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Image with flowers */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/flowers/flower5.jpg"
          alt="Flower shop background"
          layout="fill"
          objectFit="cover"
          className="opacity-100 saturate-150"
        />
      </div>

      {/* Cuadro blanco centrado y más arriba */}
      <div className="relative z-10 mt-0 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Logo centrado y sobresaliendo */}
          <div className="relative flex w-full justify-center">
            <div className="absolute left-1/2 top-0 z-30 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[20px] border-black bg-yellow-400 shadow-lg">
              <Image
                src="/images/logo/new-logo-ready-set copy.png"
                alt="Ready Set Logo"
                width={120}
                height={120}
                className="rounded-full object-contain"
                priority
              />
            </div>
            {/* <div className="w-full" /> */}
          </div>
          <div className="relative z-20 mt-16 flex w-full flex-col items-center rounded-[2.5rem] bg-white px-8 py-8 shadow-xl md:w-[700px]">
            <h2 className="mb-2 text-center text-3xl font-extrabold tracking-wide text-gray-900">
              EXPERT SUPPORT
            </h2>
            <p className="text-center text-base font-medium text-gray-700">
              WE SPECIALIZE IN FLORAL LOGISTICS, ENSURING SMOOTH DELIVERIES AND STRONG PARTNERSHIPS
              WITH LOCAL SHOPS FOR A SEAMLESS EXPERIENCE.
            </p>
          </div>
        </div>
      </div>

      {/* Partners Amarillos tipo slider al fondo */}
      <div className="absolute bottom-0 left-0 z-20 w-full pb-6">
        <div className="relative w-full">
          <Carousel
            opts={{ loop: true, skipSnaps: false, align: 'start', dragFree: false }}
            setApi={setCarouselApi}
            className="w-full"
          >
            <CarouselContent className="flex justify-center gap-5 px-2">
              {Array(4).fill(partners).flat().map((partner, idx) => (
                <CarouselItem
                  key={partner + idx}
                  className="flex basis-full items-center justify-center md:basis-1/2 lg:basis-1/4"
                >
                  <div
                    className="flex min-w-[220px] items-center justify-center whitespace-nowrap rounded-2xl border-4 border-yellow-400 bg-yellow-400 px-10 py-4 text-2xl font-extrabold text-gray-800 shadow-lg"
                    style={{ textAlign: 'center' }}
                  >
                    {partner}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-[40%] z-30 h-12 w-12 -translate-y-1/2 border-0 bg-[#F8CC48] shadow-xl hover:bg-[#F8CC48]/80" />
            <CarouselNext className="absolute right-2 top-[40%] z-30 h-12 w-12 -translate-y-1/2 border-0 bg-[#F8CC48] shadow-xl hover:bg-[#F8CC48]/80" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ExpertSupportSection;
