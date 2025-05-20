'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceFeatureProps {
  title: string;
  description: React.ReactNode;
  delay?: number;
}

const FeatureBox: React.FC<ServiceFeatureProps> = ({ title, description, delay = 0 }) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <motion.div
        className="flex h-auto w-full flex-col items-center justify-center rounded-[20px] bg-[#FFD015] p-6 py-8 shadow-md"
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h3 className="mb-4 text-center text-2xl font-black uppercase leading-tight text-black">
          {title}
        </h3>
      </motion.div>
      <div className="mt-6 max-w-[340px] px-4 text-center">
        <p className="text-center text-base leading-relaxed text-black">{description}</p>
      </div>
    </motion.div>
  );
};

const ServiceFeaturesSection: React.FC = () => {
  const serviceFeatures = [
    {
      title: 'CONSISTENT DRIVERS',
      description: (
        <>
          Our professional, reliable drivers act as an extension of your brand —punctual,
          presentable and committed to handling every delivery with care.
        </>
      ),
      delay: 0,
    },
    {
      title: 'EQUIPMENT',
      description: (
        <>
          We use insulated bags and pro-grade gear to keep food fresh, presentable and at the right
          temperature—solving a major pain point for restaurants.
        </>
      ),
      delay: 200,
    },
    {
      title: 'WORKS WITH YOU',
      description: (
        <>
          We go beyond delivery, streamlining operations to align with industry needs and elevate
          the experience into a seamless extension of your service.
        </>
      ),
      delay: 400,
    },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {serviceFeatures.map((feature, index) => (
            <FeatureBox
              key={index}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFeaturesSection;
