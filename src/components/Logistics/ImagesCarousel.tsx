import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ImageCarousel = () => {
  const images = [
    {
      src: '/images/logistics/carousel/flower1.png',
      alt: 'Pink and white flower arrangement'
    },
    {
      src: '/images/logistics/carousel/flower2.png',
      alt: 'Red roses in a vase'
    },
    {
      src: '/images/logistics/carousel/food1.jpg',
      alt: 'Catering table with various food items'
    },
    {
      src: '/images/logistics/carousel/food2.jpg',
      alt: 'Prepared food bowls with blue labels'
    }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-7xl mx-auto px-20 mb-16">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true
          }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-8">
            {[...images, ...images].map((image, index) => (
              <CarouselItem key={index} className="pl-8 basis-full md:basis-1/2 lg:basis-1/4">
                <div className="h-[400px] w-full relative rounded-3xl overflow-hidden p-2 bg-white">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="absolute -left-16 top-1/2 -translate-y-1/2 bg-[#F8CC48] hover:bg-[#F8CC48]/80 border-0 h-12 w-12"
          >
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
          <CarouselNext 
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-[#F8CC48] hover:bg-[#F8CC48]/80 border-0 h-12 w-12"
          >
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
      
      <div className="text-center max-w-3xl mx-auto px-4">
        <h2 className="text-5xl font-bold mb-4 text-gray-800">OUR SERVICES</h2>
        <p className="text-lg text-gray-600 italic">
          With Ready Set, you can trust your delivery needs are handled with precision and professionalism. Let's keep your business moving—fresh, fast, and on time.
        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;