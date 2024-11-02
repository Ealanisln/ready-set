// src/components/VirtualAssistant/FeatureCarousel.tsx

'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const features = [
  {
    iconPath: "/images/virtual/drive.svg",
    title: "Ready to Put Your Business\non Autopilot",
    alt: "Drive Icon"
  },
  {
    iconPath: "/images/virtual/time.svg",
    title: "Set your focus on\nwhat truly \nmatters",
    alt: "Time Icon"
  },
  {
    iconPath: "/images/virtual/dollar.svg",
    title: "Delegated tasks to\nincrease your\nearnings",
    alt: "Dollar Icon"
  }
]

export default function FeatureCarousel() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="w-full bg-black rounded-2xl p-6 lg:p-12 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-full md:w-1/3">
            <h2 className="text-white text-xl lg:text-2xl font-bold leading-tight">
              YOUR <br /> PRODUCTIVITY
              <br />PARNTER, ANYTIME
              <br />ANYWHERE!
            </h2>
          </div>
          
          <div className="w-full md:w-2/3">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-2 md:-ml-2">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-3 basis-full md:basis-1/3">
                    <Card className="bg-yellow-400 border-none h-full">
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-4">
                        <div className="text-black">
                          <Image
                            src={feature.iconPath}
                            alt={feature.alt}
                            width={60}
                            height={60}
                            className="w-16 h-16 md:w-20 md:h-20"
                          />
                        </div>
                        <h3 className="font-medium text-base text-black">
                          {feature.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious 
                className="absolute top-1/2 -translate-y-1/2 -left-9 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
              />
              <CarouselNext 
                className="absolute top-1/2 -translate-y-1/2 -right-10 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
              />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}