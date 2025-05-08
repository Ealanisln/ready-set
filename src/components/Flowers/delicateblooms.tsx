import React from 'react';
import Image from 'next/image';

interface DelicateBloomsProps {
  backgroundImage?: string;
}

const DelicateBlooms: React.FC<DelicateBloomsProps> = ({
  backgroundImage = '/images/flowers/background2.jpg',
}) => {
  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={backgroundImage}
          alt="Delivery background with person handling flowers"
          fill
          className="object-cover w-full h-full"
          sizes="100vw"
          priority
          quality={100}
        />
      </div>

      {/* Content wrapper with specific spacing */}
      <div className="relative z-20 flex flex-col w-full">
        {/* Header section - adjusted spacing for both mobile and desktop */}
        <div className="w-full max-w-4xl mx-auto px-8 mt-[5vh] sm:mt-[10vh]">
          <div className="mx-auto rounded-2xl sm:rounded-3xl bg-gray-800/60 px-4 py-6 sm:px-16 sm:py-12 text-center shadow-xl">
            <h1 className="text-xl font-extrabold text-white sm:text-4xl md:text-5xl">
              Delicate Blooms Deserve
              <br className="hidden sm:block" /> Gentle Hands
            </h1>
            <p className="mt-4 sm:mt-6 text-sm font-medium text-white sm:text-xl">
              Flowers Are Delicate, So We Deliver Them
              <br className="hidden sm:block" /> with Extra Care
            </p>
          </div>
        </div>

        {/* Cards section - adjusted for mobile */}
        <div className="w-full px-4 sm:px-8 mt-16 sm:mt-32 pb-8">
          <div className="mx-auto flex max-w-md flex-col items-stretch justify-between gap-6 sm:gap-8 sm:max-w-6xl sm:flex-row">
            {/* Card 1: Van */}
            <div className="relative w-full flex-1 rounded-2xl sm:rounded-3xl bg-yellow-300 shadow-xl">
              <div className="relative flex h-16 sm:h-24 w-full justify-center pt-2 sm:pt-8">
                <div className="absolute -top-28 sm:-top-40 scale-[0.35] sm:scale-75">
                  <Image
                    src="/images/flowers/van.png"
                    alt="Delivery van"
                    width={500}
                    height={420}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 pb-6 sm:pb-8 pt-8 sm:pt-8">
                <h3 className="text-center text-base font-bold sm:text-lg md:text-2xl">
                  Reliable vehicle (car or van)
                </h3>
                <ul className="mt-2 sm:mt-4 list-disc pl-4 sm:pl-5 text-xs sm:text-sm md:text-base">
                  <li>GPS or navigation app (Google Maps, Waze)</li>
                  <li>Cooler or climate control (if needed for hot weather)</li>
                </ul>
              </div>
            </div>

            {/* Card 2: Storage Box */}
            <div className="relative w-full flex-1 rounded-2xl sm:rounded-3xl bg-yellow-300 shadow-xl">
              <div className="relative flex h-16 sm:h-24 w-full justify-center pt-2 sm:pt-4">
                <div className="absolute -top-16 sm:-top-32 scale-[0.35] sm:scale-75">
                  <Image
                    src="/images/flowers/boxes.png"
                    alt="Storage box"
                    width={300}
                    height={260}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 pb-6 sm:pb-8 pt-8 sm:pt-8">
                <h3 className="text-center text-base font-bold sm:text-lg md:text-2xl">Hefty 12gal Max Pro</h3>
                <ul className="mt-2 sm:mt-4 list-disc pl-4 sm:pl-5 text-xs sm:text-sm md:text-base">
                  <li>
                    Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches, Universal
                    Storage Solution
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Nursery Pot */}
            <div className="relative w-full flex-1 rounded-2xl sm:rounded-3xl bg-yellow-300 shadow-xl">
              <div className="relative flex h-16 sm:h-24 w-full justify-center pt-2 sm:pt-4">
                <div className="absolute -top-16 sm:-top-32 scale-[0.35] sm:scale-75">
                  <Image
                    src="/images/flowers/container.png"
                    alt="Nursery pot"
                    width={240}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 pb-6 sm:pb-8 pt-8 sm:pt-8">
                <h3 className="text-center text-base font-bold sm:text-lg md:text-2xl">
                  RAOOKIF 1 Gallon Nursery Pots
                </h3>
                <ul className="mt-2 sm:mt-4 list-disc pl-4 sm:pl-5 text-xs sm:text-sm md:text-base">
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
    </div>
  );
};

export default DelicateBlooms;
