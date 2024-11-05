"use client";

interface CTAProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  logoSrc?: string;
  logoAlt?: string;
  onButtonClick?: () => void;
}

import React from 'react';

interface CTAProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const DiscoveryBanner: React.FC<CTAProps> = ({
  heading = "Your business could be rapidly approaching its ceiling.",
  subheading = "Why limit yourself with how your business works today? Book a Discovery Call now to smash through your business ceiling and scale up the right way—before clients start walking out on you.",
  buttonText = "BOOK A DISCOVERY CALL",
  logoSrc = "/images/logo/new-logo-ready-set.png" ,
  logoAlt = "Ready Set logo" ,
  onButtonClick = () => {},
}) => {
  return (
    <div className="relative w-full">
      <div className="relative bg-[#ffd766] w-full pt-10">
        {/* Top curve */}
        <div className="absolute inset-x-0 top-0">
          <svg 
            className="w-full h-16" 
            viewBox="0 0 1440 50" 
            preserveAspectRatio="none"
          >
            <path 
              fill="white"
              d="M0,50 C360,20 720,20 1440,50 L1440,0 L0,0 Z"
            />
          </svg>
        </div>

        {/* Content container */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] max-w-3xl mx-auto">
              Your business could be <span className="font-extrabold">rapidly approaching its ceiling.</span>
            </h2>
            
            <p className="text-lg text-gray-800 max-w-3xl mx-auto">
              {subheading}
            </p>

            <div className="flex flex-col items-center space-y-8">
              <button 
                onClick={onButtonClick}
                className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2a2a2a] transition-colors text-lg uppercase tracking-wide"
              >
                {buttonText}
              </button>
              <div className="w-32 h-32 mt-8 flex items-center justify-center p-4">
                <img
                src={logoSrc}
                alt={logoAlt}
                className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default DiscoveryBanner;