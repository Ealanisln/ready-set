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

      {/* Cards section - Positioned absolutely near the bottom */}
      <div className="absolute bottom-10 left-4 right-4 z-30">
        {/* Re-apply mx-auto and max-w to the inner flex container for centering */}
        <div className="mx-auto flex max-w-md flex-col items-center justify-between gap-4 sm:max-w-6xl sm:flex-row sm:items-stretch">
          {/* Card 1: Van */}
          <div className="relative w-full flex-1 rounded-3xl bg-yellow-300 shadow-lg">
            <div className="relative flex h-16 w-full justify-center pt-3 sm:h-20 sm:pt-4">
              <div className="absolute -top-24 scale-50 sm:-top-28 sm:scale-100">
                <Image
                  src="/images/flowers/van.png"
                  alt="Delivery van"
                  width={600}
                  height={520}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="w-full px-4 pb-4 pt-10 sm:pt-8">
              <h3 className="text-center text-base font-bold sm:text-xl">
                Reliable vehicle (car or van)
              </h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>GPS or navigation app (Google Maps, Waze)</li>
                <li>Cooler or climate control (if needed for hot weather)</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Storage Box - Restore content and adjust image position */}
          <div className="relative w-full flex-1 rounded-3xl bg-yellow-300 shadow-lg">
            {/* Keep card height */}
            <div className="relative flex h-16 w-full justify-center pt-3 sm:h-20 sm:pt-4">
              {/* Apply responsive top offset and scaling: higher/smaller for mobile, original for sm+ */}
              {/* Increase negative top offset slightly for mobile on the second card */}
              <div className="absolute -top-36 scale-50 sm:-top-44 sm:scale-100">
                <Image
                  src="/images/flowers/boxes.png"
                  alt="Storage box"
                  width={300}
                  height={260}
                  className="object-contain"
                />
              </div>
            </div>
            {/* Restore text content and keep padding */}
            <div className="w-full px-4 pb-4 pt-10 sm:pt-8">
              <h3 className="text-center text-base font-bold sm:text-xl">Hefty 12gal Max Pro</h3>
              <ul className="mt-2 list-disc pl-5 text-sm sm:text-base">
                <li>
                  Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches, Universal
                  Storage Solution
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Nursery Pot - Keep existing correct styles */}
          <div className="relative mt-4 w-full flex-1 rounded-3xl bg-yellow-300 shadow-lg sm:mt-0">
            {/* Match card height and image container padding from Card 1 */}
            <div className="relative flex h-16 w-full flex-col items-center justify-center pt-3 sm:h-20 sm:pt-4">
              {/* Apply responsive top offset and scaling: higher/smaller for mobile, original for sm+ */}
              {/* Reduce scale for mobile on the third card */}
              <div className="absolute -top-32 scale-50 sm:-top-44 sm:scale-100">
                <Image
                  src="/images/flowers/container.png"
                  alt="Nursery pot"
                  width={240} // Adjusted size for consistency
                  height={200} // Adjusted size for consistency
                  className="object-contain" // Removed mt-4
                />
              </div>
            </div>
            {/* Match text padding from Card 1 */}
            <div className="w-full px-4 pb-4 pt-10 sm:pt-8">
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
