'use client'

import React from 'react';

const Logo = () => {
  return (
    <div className="mt-4 flex flex-col items-center">
      <img
        src="/images/logo/new-logo-ready-set.webp"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.onerror = null;
          img.src = "/images/logo/new-logo-ready-set.png";
        }}
        alt="Company logo"
        className="mb-2 h-auto w-24"
      />
      <div className="rounded-lg bg-black px-4 py-0 text-white">
        <p className="text-sm tracking-wider">READY SET GROUP, LLC</p>
      </div>
    </div>
  );
};

export default Logo;