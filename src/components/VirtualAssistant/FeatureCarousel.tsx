// src/components/VirtualAssistant/FeatureCarousel.tsx

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const features = [
  {
    iconPath: "/images/virtual/drive.svg",
    title: "Put Your Business\non Autopilot",
    alt: "Drive Icon",
  },
  {
    iconPath: "/images/virtual/time.svg",
    title: "Focus your\ntime on  \n what matters",
    alt: "Time Icon",
  },
  {
    iconPath: "/images/virtual/dollar.svg",
    title: "Delegated tasks to\n grow revenue",
    alt: "Dollar Icon",
  },
];

export default function FeatureCarousel() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 w-full rounded-2xl bg-black p-6 shadow-lg lg:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold leading-tight text-white lg:text-2xl">
              YOUR <br /> PRODUCTIVITY
              <br />
              PARTNER, ANYTIME
              <br />
              ANYWHERE!
            </h2>
          </div>

          <div className="w-full md:w-2/3">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="relative w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-2">
                {features.map((feature, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full pl-2 md:basis-1/3 md:pl-3"
                  >
                    <Card className="mx-auto h-full max-w-xs border-none bg-yellow-400">
                      {" "}
                      {/* Added max-w-xs and mx-auto */}
                      <CardContent className="flex flex-col items-center justify-center space-y-3 p-3 text-center">
                        {" "}
                        {/* Reduced padding and spacing */}
                        <div className="font-bold text-black">
                          <Image
                            src={feature.iconPath}
                            alt={feature.alt}
                            width={50} // Reduced from 60
                            height={50} // Reduced from 60
                            className="h-12 w-12 md:h-16 md:w-16" // Reduced from w-16/h-16 and w-20/h-20
                          />
                        </div>
                        <h3 className="text-sm font-bold text-black md:text-base">
                          {" "}
                          {/* Reduced text size */}
                          {feature.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-9 top-1/2 -translate-y-1/2 border-none bg-yellow-400 text-black hover:bg-yellow-500" />
              <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 border-none bg-yellow-400 text-black hover:bg-yellow-500" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
