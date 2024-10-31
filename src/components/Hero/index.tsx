"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Truck, Headphones, Users, LucideIcon } from "lucide-react";

interface ButtonLinkProps {
  href: string;
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, icon, title, description }) => {
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 h-full">
        <div className="text-primary mb-2 sm:mb-4">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-balance">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 text-balance">
          {description}
        </p>
      </div>
    </Link>
  );
};

const LandingPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === 'dark' 
    ? '/images/logo/full-logo-dark.png'
    : '/images/logo/full-logo-light.png';

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 pt-8 sm:pt-12">
      <header className="text-center mb-12 sm:mb-16 flex flex-col items-center w-full px-4 sm:px-6">
        {/* Add width to prevent layout shift */}
        <div className="w-full max-w-[600px] mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8 mt-6 sm:mt-8 text-balance">
            Ready Set Group LLC
          </h1>
        </div>
        
        {/* Add explicit width/height to prevent layout shift */}
        <div className="relative w-[300px] h-[200px] sm:w-[400px] sm:h-[300px] md:w-[500px] md:h-[400px] mb-6 sm:mb-10">
          <Image
            src={logoSrc}
            alt="Ready Set Group LLC Logo"
            fill
            sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, 500px"
            className="object-contain"
            priority
          />
        </div>
        
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mt-4 sm:mt-6 text-balance">
          Choose your destination
        </p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ButtonLink 
          href="/logistics" 
          icon={<Truck strokeWidth={1.5} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />}
          title="Logistics"
          description="Join our logistics team and be part of a dynamic supply chain network"
        />
        <ButtonLink 
          href="/va" 
          icon={<Headphones strokeWidth={1.5} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />}
          title="Virtual Assistant"
          description="Become a virtual assistant and work flexibly from anywhere"
        />
        <ButtonLink 
          href="/join-the-team" 
          icon={<Users strokeWidth={1.5} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />}
          title="Join the Team"
          description="Explore various exciting positions available in our growing company"
        />
      </div>
    </div>
  );
};

export default LandingPage;