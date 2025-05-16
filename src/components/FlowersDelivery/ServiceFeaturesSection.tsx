'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceFeatureProps {
  icon: string;
  title: string;
  description: React.ReactNode;
  delay?: number;
}

const FeatureBox: React.FC<ServiceFeatureProps> = ({ icon, title, description, delay = 0 }) => {
  const adjustedTitle =
    title === 'Bulk Orders? No Problem!' ? (
      <>
        Bulk Orders?
        <br />
        No Problem!
      </>
    ) : (
      title
    );

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <motion.div
        className="flex h-[320px] w-full flex-col items-center justify-center rounded-[50px] bg-[#FFD015] p-8 shadow-md"
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Image
          src={icon}
          alt={typeof title === 'string' ? title : ''}
          width={220}
          height={220}
          className="mb-6"
          priority
        />
        <h3 className="text-center text-3xl font-black leading-tight text-black">
          {adjustedTitle}
        </h3>
      </motion.div>
      <div className="mt-6 max-w-[340px] px-4">
        <p className="text-center text-base leading-relaxed text-black">{description}</p>
      </div>
    </motion.div>
  );
};

const ServiceFeaturesSection: React.FC = () => {
  const serviceFeatures = [
    {
      icon: '/images/flowers/computer.svg',
      title: 'Bulk Orders? No Problem!',
      description: (
        <span>
          We handle a <span className="font-extrabold">minimum of 10 bulk orders</span> per route,
          making your logistics smoother and more efficient.
        </span>
      ),
      delay: 0,
    },
    {
      icon: '/images/flowers/truck.svg',
      title: 'Personalized Delivery Service',
      description:
        "You'll get a dedicated driver assigned to your shop. No more guessing who's coming—just familiar, reliable service every time.",
      delay: 200,
    },
    {
      icon: '/images/flowers/agent.svg',
      title: 'Hands-On Support',
      description:
        "Our helpdesk monitors every delivery from dispatch to doorstep, keeping you updated in real-time so you're never in the dark — so you can focus more on operations while we handle the admin work.",
      delay: 400,
    },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-4xl font-bold text-gray-800 md:text-5xl">
            It's Not Just What We Do
          </h2>
          <h2 className="text-4xl font-bold text-gray-800 md:text-5xl">It's How We Do It</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {serviceFeatures.map((feature, index) => (
            <FeatureBox
              key={index}
              icon={feature.icon}
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
