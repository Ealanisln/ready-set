import React from 'react';
import Image from 'next/image';

interface DelicateBloomsProps {
  backgroundImage?: string;
}

const DelicateBlooms: React.FC<DelicateBloomsProps> = ({
  backgroundImage = '/images/flowers/flower6.jpg',
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden bg-gray-100">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt="Delivery background with person handling flowers"
        fill
        className="object-cover"
        priority
      />

      {/* Semi-transparent header overlay - reduced padding for tablet */}
      <div className="relative z-20 mx-auto mt-6 w-full max-w-4xl px-4 sm:mt-4">
        <div className="mx-auto rounded-3xl bg-gray-800/60 px-5 py-6 text-center shadow-xl sm:px-8 sm:py-7">
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
            Delicate Blooms Deserve
            <br className="hidden sm:block" />
            Gentle Hands
          </h1>
          <p className="mt-3 text-base font-medium text-white sm:text-lg md:mt-4 md:text-xl">
            Flowers Are Delicate, So We Deliver Them
            <br className="hidden sm:block" />
            with Extra Care
          </p>
        </div>
      </div>

      {/* Cards section - Positioned to match screenshot */}
      <div className="relative z-30 mt-14 p-4 pb-8 sm:p-6 md:p-10">
        {/* Cards are now relative positioned and pushed down more for tablet/desktop screens */}
        <div className="sm:mt-64 md:mt-72">
          {/* Re-apply mx-auto and max-w to the inner flex container - reduced size for tablet */}
          <div className="mx-auto flex max-w-md flex-col items-center gap-8 sm:max-w-5xl sm:flex-row sm:items-stretch sm:gap-3 md:max-w-6xl md:gap-4">
            {/* Card 1: Van - Adjusted position for tablet */}
            <div className="relative w-full rounded-3xl bg-yellow-300 pb-6 pt-6 shadow-lg sm:pb-6 sm:pt-0 md:pb-8">
              <div className="relative flex justify-center pt-8 sm:pt-6 md:pt-10">
                <div className="absolute -top-28 sm:-top-20 sm:scale-75 md:-top-28 md:scale-100">
                  {/* Adjusted position for tablet view */}
                  <Image
                    src="/images/flowers/van.png"
                    alt="Delivery van"
                    width={500}
                    height={433}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="px-4 pt-24 sm:pt-24 md:pt-20">
                <h3 className="text-center text-lg font-bold sm:text-base md:text-xl">
                  Reliable vehicle (car or van)
                </h3>
                <ul className="mt-2 list-disc pl-5 text-sm sm:text-xs md:text-base">
                  <li>GPS or navigation app (Google Maps, Waze)</li>
                  <li>Cooler or climate control (if needed for hot weather)</li>
                </ul>
              </div>
            </div>

            {/* Card 2: Storage Box - Reduced size for tablet */}
            <div className="relative w-full rounded-3xl bg-yellow-300 pb-6 pt-6 shadow-lg sm:pb-6 sm:pt-0 md:pb-8">
              <div className="relative flex justify-center pt-8 sm:pt-6 md:pt-10">
                <div className="absolute -top-24 sm:-top-20 sm:scale-75 md:-top-36 md:scale-100">
                  {/* Only on tablet (sm breakpoint), adjust the image position and size */}
                  <Image
                    src="/images/flowers/boxes.png"
                    alt="Storage box"
                    width={260}
                    height={225}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="px-4 pt-32 sm:pt-24 md:pt-20">
                <h3 className="text-center text-lg font-bold sm:text-base md:text-xl">
                  Hefty 12gal Max Pro
                </h3>
                <ul className="mt-2 list-disc pl-5 text-sm sm:text-xs md:text-base">
                  <li>
                    Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches, Universal
                    Storage Solution
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Nursery Pot - Reduced size for tablet */}
            <div className="relative w-full rounded-3xl bg-yellow-300 pb-6 pt-6 shadow-lg sm:pb-6 sm:pt-0 md:pb-8">
              <div className="relative flex justify-center pt-8 sm:pt-6 md:pt-10">
                <div className="absolute -top-24 sm:-top-20 sm:scale-75 md:-top-32 md:scale-100">
                  <Image
                    src="/images/flowers/container.png"
                    alt="Nursery pot"
                    width={200}
                    height={167}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="px-4 pt-24 sm:pt-20">
                <h3 className="text-center text-lg font-bold sm:text-base md:text-xl">
                  RAOOKIF 1 Gallon Nursery Pots
                </h3>
                <ul className="mt-1 list-disc pl-5 text-sm sm:text-xs md:text-base">
                  <li>
                    Flexible 1 Gallon Posts for Plants, 1 Gallon Plastic Plant Pots for Seedling,
                    Cuttings, Succulents, Transpanting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Added extra bottom padding for mobile only */}
        <div className="h-12 sm:h-0"></div>
      </div>
    </div>
  );
};

export default DelicateBlooms;
