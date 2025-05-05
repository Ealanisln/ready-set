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

      {/* Semi-transparent header overlay - moved to relative positioning */}
      <div className="relative z-20 mx-auto mt-8 w-full max-w-4xl px-4">
        <div className="mx-auto rounded-3xl bg-gray-800/60 px-6 py-8 text-center shadow-xl sm:px-12 sm:py-10">
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Delicate Blooms Deserve
            <br className="hidden sm:block" />
            Gentle Hands
          </h1>
          <p className="mt-4 text-base font-medium text-white sm:text-xl">
            Flowers Are Delicate, So We Deliver Them
            <br className="hidden sm:block" />
            with Extra Care
          </p>
        </div>
      </div>

      {/* Cards section - Positioned absolutely near the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-10">
        {/* Re-apply mx-auto and max-w to the inner flex container for centering and responsive layout */}
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:max-w-6xl sm:flex-row sm:items-stretch">
          {/* Card 1: Van */}
          <div className="relative w-full flex-1 rounded-3xl bg-yellow-300 pb-6 shadow-lg sm:pb-8">
            <div className="relative flex justify-center pt-8 sm:pt-10">
              {' '}
              {/* Increased paddingTop */}
              <div className="absolute -top-20 scale-75 sm:-top-28 sm:scale-100">
                <Image
                  src="/images/flowers/van.png"
                  alt="Delivery van"
                  width={500}
                  height={433}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="px-4 pt-16 sm:pt-20">
              {' '}
              {/* Increased paddingTop */}
              <h3 className="text-center text-lg font-bold sm:text-xl">
                Reliable vehicle (car or van)
              </h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>GPS or navigation app (Google Maps, Waze)</li>
                <li>Cooler or climate control (if needed for hot weather)</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Storage Box */}
          <div className="relative w-full flex-1 rounded-3xl bg-yellow-300 pb-6 shadow-lg sm:pb-8">
            <div className="relative flex justify-center pt-8 sm:pt-10">
              {' '}
              {/* Increased paddingTop */}
              <div className="absolute -top-24 scale-75 sm:-top-36 sm:scale-100">
                <Image
                  src="/images/flowers/boxes.png"
                  alt="Storage box"
                  width={260}
                  height={225}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="px-4 pt-16 sm:pt-20">
              {' '}
              {/* Increased paddingTop */}
              <h3 className="text-center text-lg font-bold sm:text-xl">Hefty 12gal Max Pro</h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>
                  Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches, Universal
                  Storage Solution
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Nursery Pot */}
          <div className="relative mt-4 w-full flex-1 rounded-3xl bg-yellow-300 pb-6 shadow-lg sm:mt-0 sm:pb-8">
            <div className="relative flex justify-center pt-8 sm:pt-10">
              {' '}
              {/* Increased paddingTop */}
              <div className="absolute -top-20 scale-75 sm:-top-32 sm:scale-100">
                <Image
                  src="/images/flowers/container.png"
                  alt="Nursery pot"
                  width={200}
                  height={167}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="px-4 pt-16 sm:pt-20">
              {' '}
              {/* Increased paddingTop */}
              <h3 className="text-center text-lg font-bold sm:text-xl">
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
