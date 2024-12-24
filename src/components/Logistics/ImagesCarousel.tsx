import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageCarousel = () => {
  const images = [
    {
      src: "/images/logistics/carousel/1.png",
      alt: "Catering buffet with various hot dishes and garnished items in chafing dishes",
    },
    {
      src: "/images/logistics/carousel/2.png",
      alt: "Florist arranging colorful spring bouquet with tulips and mixed flowers",
    },
    {
      src: "/images/logistics/carousel/3.png",
      alt: "Assorted fresh baked pastries and bread with decorative patterns",
    },
    {
      src: "/images/logistics/carousel/4.png",
      alt: "Hands exchanging cardboard delivery boxes outdoors",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto mb-16 w-full max-w-7xl px-20">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-8">
            {[...images, ...images].map((image, index) => (
              <CarouselItem
                key={index}
                className="basis-full pl-8 md:basis-1/2 lg:basis-1/4"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-white p-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-16 top-1/2 h-12 w-12 -translate-y-1/2 border-0 bg-[#F8CC48] hover:bg-[#F8CC48]/80">
            <span className="sr-only">Previous slide</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </CarouselPrevious>
          <CarouselNext className="absolute -right-16 top-1/2 h-12 w-12 -translate-y-1/2 border-0 bg-[#F8CC48] hover:bg-[#F8CC48]/80">
            <span className="sr-only">Next slide</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </CarouselNext>
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;
