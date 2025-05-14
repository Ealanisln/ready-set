'use client';

import Image from 'next/image';
import React from 'react';

const MainMeal: React.FC = () => {
  return (
    <div className="relative min-h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/food/fooddeliverybg1.png"
          alt="Fondo de Comida"
          fill
          style={{ objectFit: 'cover' }}
          className="saturate-125 opacity-90"
        />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {/* Just the image itself with no container */}
        <Image
          src="/images/food/mainmeal.png"
          alt="Buffet de Comida"
          width={1000}
          height={500}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default MainMeal;
