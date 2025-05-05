'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// import '../../styles/popup.css';

interface ServiceFeatureProps {
  icon: string;
  title: string;
  description: React.ReactNode;
}

const ServiceFeature: React.FC<ServiceFeatureProps> = ({ icon, title, description }) => {
  // For "Bulk Orders? No Problem!" force line breaks for 2 lines
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
    <div className="flex flex-1 flex-col items-center">
      <motion.div
        className={`font-your-custom-font flex h-[300px] w-[300px] flex-col items-center justify-center rounded-[60px] bg-[#FFD015] p-8 shadow-lg outline-none`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex h-full w-full flex-col items-center justify-start">
          <Image
            src={icon}
            alt={typeof title === 'string' ? title : ''}
            width={140}
            height={140}
            className="mb-8"
          />
          <h3 className="mt-4 flex h-auto flex-grow items-start justify-center px-2 text-center text-2xl font-black leading-tight tracking-tight">
            {adjustedTitle}
          </h3>
        </div>
      </motion.div>
      <p className="font-your-custom-font mt-6 max-w-[320px] text-justify text-base leading-snug text-black">
        {description}
      </p>
    </div>
  );
};

const FlowerIcons: React.FC = () => {
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
    },
    {
      icon: '/images/flowers/truck.svg',
      title: 'Personalized Delivery Service',
      description:
        "You'll get a dedicated driver assigned to your shop. No more guessing who's coming—just familiar, reliable service every time.",
    },
    {
      icon: '/images/flowers/agent.svg',
      title: 'Hands-On Support',
      description:
        "Our helpdesk monitors every delivery from dispatch to doorstep, keeping you updated in real-time so you're never in the dark — so you can focus more on operations while we handle the admin work.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 px-4 text-center">
        <h2 className="mb-2 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight">
          It's Not Just What We Do
        </h2>
        <h2 className="mb-0 text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight">
          It's How We Do It
        </h2>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-8 md:flex-row">
        {serviceFeatures.map((feature, index) => (
          <ServiceFeature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowerIcons;
