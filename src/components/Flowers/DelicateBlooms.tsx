import React from 'react';
import Image from 'next/image';

interface DelicateBloomsProps {
  backgroundImage?: string;
}

const DelicateBlooms: React.FC<DelicateBloomsProps> = ({
  backgroundImage = '/images/flowers/deliverywoman.jpg',
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

      {/* Semi-transparent header overlay - moved to relative positioning */}
      <div className="relative z-20 mx-auto mt-8 w-full max-w-4xl px-4">
        <div className="mx-auto rounded-3xl bg-gray-800/60 px-6 py-6 text-center shadow-xl sm:px-12 sm:py-10">
          <h1 className="text-2xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Delicate Blooms Deserve
            <br />
            Gentle Hands
          </h1>
          <p className="mt-4 text-base font-medium text-white sm:text-xl">
            Flowers Are Delicate, So We Deliver Them
            <br />
            with Extra Care
          </p>
        </div>
      </div>

      {/* Cards section - switched to relative positioning */}
      <div className="relative z-30 mx-auto mt-6 w-full max-w-md px-4 pb-20 sm:mt-8 sm:max-w-6xl">
        {/* Cards flex container - vertical on mobile, horizontal on larger screens */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-stretch">
          {/* Card 1: Van */}
          <div className="w-full flex-1 overflow-hidden rounded-3xl bg-yellow-300 shadow-lg">
            {/* Image container with padding around */}
            <div className="relative flex h-28 w-full items-center justify-center p-4 sm:h-52 sm:p-6">
              <Image
                src="/images/flowers/van.png"
                alt="Delivery van"
                width={200}
                height={160}
                className="object-contain"
              />
            </div>
            {/* Text content - title centered on all screen sizes */}
            <div className="w-full px-4 pb-4">
              <h3 className="text-center text-base font-bold sm:text-xl">
                Reliable vehicle (car or van)
              </h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>GPS or navigation app (Google Maps, Waze)</li>
                <li>Cooler or climate control (if needed for hot weather)</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Storage Box */}
          <div className="mt-4 w-full flex-1 overflow-hidden rounded-3xl bg-yellow-300 shadow-lg sm:mt-0">
            {/* Image container - adjusted padding and added margin-top for mobile only */}
            <div className="relative flex h-32 w-full flex-col items-center justify-center p-4 sm:h-52 sm:p-6">
              <div className="relative mt-6 sm:mt-0">
                <Image
                  src="/images/flowers/boxes.png"
                  alt="Storage box"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>
            </div>
            {/* Text content - title centered on all screen sizes */}
            <div className="w-full px-4 pb-4">
              <h3 className="text-center text-base font-bold sm:text-xl">Hefty 12gal Max Pro</h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>
                  Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches, Universal
                  Storage Solution
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Nursery Pot - made more compact */}
          <div className="mt-4 w-full flex-1 overflow-hidden rounded-3xl bg-yellow-300 shadow-lg sm:mt-0">
            {/* Image container with measurements */}
            <div className="relative flex h-32 w-full flex-col items-center justify-center p-4 sm:h-52 sm:p-6">
              <div className="relative">
                {/* Simplified measurements */}
                <div className="absolute left-1/4 top-0 text-xs font-semibold">
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-12 bg-black"></div>
                  </div>
                </div>
                <div className="absolute left-0 top-1/3 text-xs font-semibold">
                  <div className="flex items-center"></div>
                </div>
                <Image
                  src="/images/flowers/container.png"
                  alt="Nursery pot"
                  width={160}
                  height={120}
                  className="mt-4 object-contain"
                />
              </div>
            </div>
            {/* Text content - title centered on all screen sizes */}
            <div className="w-full px-4 pb-4">
              <h3 className="text-center text-base font-bold sm:text-xl">
                RAOOKIF 1 Gallon Nursery Pots
              </h3>
              <ul className="mt-1 list-disc pl-5 text-sm sm:text-base">
                <li>
                  Flexible 1 Gallon Posts for Plants, 1 Gallon Plastic Plant Pots for Seedling,
                  Cuttings, Succulents, Transpanting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelicateBlooms;
