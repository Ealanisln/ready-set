import Image from "next/image";
import React from "react";

interface ExpertSupportSectionProps {
  variant?: "dark" | "light";
}

const ExpertSupportSection: React.FC<ExpertSupportSectionProps> = ({
  variant = "dark",
}) => {
  // Partner data for bottom buttons - in the exact order shown in the screenshot
  const partners = [
    "FTD",
    "Bloom Link",
    "H Bloom",
    "Dove / Teleflora",
    "Lovingly",
    "Floom",
    "Bloom Nation",
    "Flower Shop",
  ];

  // Choose which variant to render
  if (variant === "dark") {
    return <DarkVariant partners={partners} />;
  }

  return <LightVariant partners={partners} />;
};

// Dark variant (Image 1)
const DarkVariant: React.FC<{ partners: string[] }> = ({ partners }) => {
  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Expert Support Box */}
          <div className="z-10 w-full lg:w-1/2">
            <div className="rounded-lg bg-yellow-400 p-6">
              <div className="mb-4 flex items-start">
                {/* Icon Circle */}
                <div className="mr-4 rounded-full bg-white p-4">
                  <div className="relative h-12 w-12">
                    <Image
                      src="/images/headset-icon.png"
                      alt="Headset icon"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold text-gray-800">
                  Expert Support
                </h2>
              </div>

              {/* Support text */}
              <p className="mb-6 text-lg text-gray-800">
                Our expertise in handling major floral industry platforms
                ensures a smooth and hassle-free delivery process, including{" "}
                <span className="font-bold">
                  FTD, Flower Shop Network, Bloom Link, H Bloom, Dove /
                  Teleflora, Lovingly, Floom, and Bloom Nation
                </span>
                . We also partner with local flower shops to bring you the best
                floral delivery experience.
              </p>

              {/* Call to action buttons */}
              <div className="mb-6 flex flex-wrap gap-4">
                <button className="rounded-md bg-yellow-300 px-8 py-3 font-bold text-gray-800 hover:bg-yellow-400">
                  Get a qoute
                </button>
                <button className="rounded-md bg-yellow-300 px-8 py-3 font-bold text-gray-800 hover:bg-yellow-400">
                  Book a Call
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Customer support agent image */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative h-[400px]">
              <Image
                src="/images/flowers/deskgirl.png"
                alt="Customer support agent with headset"
                layout="fill"
                objectFit="contain"
                objectPosition="bottom right"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom partner buttons */}
        <div className="z-20 mt-8 flex flex-wrap justify-center gap-2">
          {partners.map((partner) => (
            <button
              key={partner}
              className="rounded-full bg-white px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-100"
            >
              {partner}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Light variant (Image 2)
const LightVariant: React.FC<{ partners: string[] }> = ({ partners }) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Image - flower shop with plants */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/flowers/flower-shop-background.jpg"
          alt="Flower shop background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Expert Support Box */}
          <div className="p-4 md:w-1/2">
            <div className="rounded-lg bg-yellow-400 p-4">
              {/* Icon and Title */}
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-full bg-white p-2">
                  <div className="relative h-12 w-12">
                    <Image
                      src="/images/flowers/headset-icon.png"
                      alt="Headset Icon"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-800">
                  Expert Support
                </h2>
              </div>

              {/* Text content */}
              <p className="mb-6 leading-relaxed text-gray-800">
                Our expertise in handling major floral industry platforms
                ensures a smooth and hassle-free delivery process, including{" "}
                <span className="font-bold">
                  FTD, Flower Shop Network, Bloom Link, H Bloom, Dove /
                  Teleflora, Lovingly, Floom, and Bloom Nation
                </span>
                . We also partner with local flower shops to bring you the best
                floral delivery experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex space-x-4">
                <button className="rounded bg-yellow-300 px-6 py-2 font-bold text-gray-800">
                  Get a qoute
                </button>
                <button className="rounded bg-yellow-300 px-6 py-2 font-bold text-gray-800">
                  Book a Call
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Support agent image */}
          <div className="relative md:w-1/2">
            <div className="relative h-[500px]">
              <Image
                src="/images/flowers/deskgirl.png"
                alt="Support agent with headset"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom partner buttons */}
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {partners.map((partner) => (
            <button
              key={partner}
              className="rounded-full bg-white px-6 py-2 text-gray-800 shadow-md"
            >
              {partner}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertSupportSection;
