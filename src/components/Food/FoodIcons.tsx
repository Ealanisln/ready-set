'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceFeatureProps {
  icon: string;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
}

const ServiceFeature: React.FC<ServiceFeatureProps> = ({ icon, title, subtitle, description }) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <motion.div
        className="flex h-[320px] w-[320px] flex-col items-center justify-start rounded-[24px] bg-[#FFD84D] p-6 pt-16"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex w-full flex-col items-center">
          <div className="mb-6 flex h-[100px] items-center justify-center">
            <Image src={icon} alt={title} width={100} height={100} />
          </div>
          <div className="text-center">
            {subtitle ? (
              <>
                <h3 className="text-2xl font-bold uppercase text-[#333333]">{title}</h3>
                <h3 className="text-2xl font-bold uppercase text-[#333333]">{subtitle}</h3>
              </>
            ) : (
              <h3 className="text-2xl font-bold uppercase text-[#333333]">{title}</h3>
            )}
          </div>
        </div>
      </motion.div>
      <p className="mt-6 max-w-[320px] text-justify text-base leading-snug text-black">
        {description}
      </p>
    </div>
  );
};

const FoodIcons: React.FC = () => {
  const serviceFeatures = [
    {
      icon: '/images/flowers/truck.svg', // Update with actual truck icon path
      title: 'RELIABLE',
      subtitle: 'CONSISTENT DRIVERS',
      description:
        'Our professional, reliable drivers act as an extension of your brand—punctual, presentable and committed to handling every delivery with care.',
    },
    {
      icon: '/images/flowers/bag.svg', // Update with actual bag/equipment icon path
      title: 'PROPER',
      subtitle: 'EQUIPMENT',
      description:
        'We use insulated bags and pro-grade gear to keep food fresh, presentable and at the right temperature—solving a major pain point for restaurants.',
    },
    {
      icon: '/images/flowers/agent.svg', // Update with actual customer service icon path
      title: 'DELIVERY THAT',
      subtitle: 'WORKS WITH YOU',
      description:
        'We go beyond delivery, streamlining operations to align with industry needs and elevate the experience into a seamless extension of your service.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-12 px-4 text-center">
        <h2 className="mb-2 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight">
          It's Not Just What We Do
        </h2>
        <h2 className="mb-8 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight">
          It's How We Do It
        </h2>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-8 md:flex-row">
        {serviceFeatures.map((feature, index) => (
          <ServiceFeature
            key={index}
            icon={feature.icon}
            title={feature.title}
            subtitle={feature.subtitle}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodIcons;
