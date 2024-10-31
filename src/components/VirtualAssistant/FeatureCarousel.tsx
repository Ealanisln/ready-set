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
import { GraduationCap, MousePointerClick, UserCog } from "lucide-react"

const features = [
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Industry Profes-\nsional UK Writers"
  },
  {
    icon: <MousePointerClick className="h-8 w-8" />,
    title: "Try Before You\nBuy"
  },
  {
    icon: <UserCog className="h-8 w-8" />,
    title: "Dedicated Ac-\ncount Managers"
  }
]

export default function FeatureCarousel() {
  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="w-full bg-black rounded-3xl p-8 lg:p-16 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-full md:w-1/3">
            <h2 className="text-white text-3xl lg:text-4xl font-bold leading-tight">
              BEST PLATFORM
              <br />TO LEARN
              <br />EVERYTHING
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
              <CarouselContent className="-ml-2 md:-ml-4">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                    <Card className="bg-yellow-400 border-none">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="text-black">
                          {feature.icon}
                        </div>
                        <h3 className="font-medium text-sm text-black whitespace-pre-line">
                          {feature.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious 
                className="absolute top-1/2 -translate-y-1/2 -left-12 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
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