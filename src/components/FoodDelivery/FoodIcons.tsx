'use client';

import React from 'react';
import Image from 'next/image';

interface ServiceFeatureProps {
  imageUrl: string;
  altText: string;
  description: React.ReactNode;
}

const ServiceFeature: React.FC<ServiceFeatureProps> = ({ imageUrl, altText, description }) => {
  return (
    <div className="flex flex-1 flex-col items-center px-4">
      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[24px]">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover"
        />
      </div>
      <p className="mt-6 w-full max-w-[280px] text-center text-base leading-snug text-black sm:text-justify">
        {description}
      </p>
    </div>
  );
};

const FoodIcons: React.FC = () => {
  const serviceFeatures = [
    {
      imageUrl: '/images/food/cards/truck.png',
      altText: 'Reliable Delivery Truck',
      description:
        'Our professional, reliable drivers act as an extension of your brand—punctual, presentable and committed to handling every delivery with care.',
    },
    {
      imageUrl: '/images/food/cards/bag.png',
      altText: 'Proper Equipment Bag',
      description:
        'We use insulated bags and pro-grade gear to keep food fresh, presentable and at the right temperature—solving a major pain point for restaurants.',
    },
    {
      imageUrl: '/images/food/cards/headset.png',
      altText: 'Delivery Support Headset',
      description:
        'We go beyond delivery, streamlining operations to align with industry needs and elevate the experience into a seamless extension of your service.',
    },
  ];

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/food/bagbg.png')` }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight text-black">
            It's Not Just What We Do
          </h2>
          <h2 className="mb-8 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight text-black">
            It's How We Do It
          </h2>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-stretch md:gap-4 lg:gap-8">
          {serviceFeatures.map((feature, index) => (
            <ServiceFeature
              key={index}
              imageUrl={feature.imageUrl}
              altText={feature.altText}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodIcons;
