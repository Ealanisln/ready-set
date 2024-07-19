"use client";

import Image from "next/image";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const images = [
  {
    webp: "/images/hero/slider1.webp",
    png: "/images/hero/slider1.png",
    alt: "Image 1 description",
  },
  {
    webp: "/images/hero/slider2.webp",
    png: "/images/hero/slider2.png",
    alt: "Image 2 description",
  },
  {
    webp: "/images/hero/slider3.webp",
    png: "/images/hero/slider3.png",
    alt: "Image 3 description",
  },
];

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="mx-auto w-full max-w-[845px]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
     <CarouselContent>
  {images.map((image, index) => (
    <CarouselItem key={index}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9]">
            <picture>
              <source srcSet={image.webp} type="image/webp" />
              <source srcSet={image.png} type="image/png" />
              <Image
                src={image.webp}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 845px"
                quality={80}
                priority={index === 0}
                className="object-cover rounded-md"
              />
            </picture>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  ))}
</CarouselContent>
    </Carousel>
  );
}
