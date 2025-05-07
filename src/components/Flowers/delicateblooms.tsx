import React from 'react';
import Image from 'next/image';

const DelicateBlooms: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-100">
      {/* Imagen de fondo */}
      <Image
        src="/images/flowers/deliverywoman.jpg"
        alt="Delivery background"
        fill
        className="object-cover brightness-90 saturate-150"
        priority
      />

      {/* Overlay oscuro para el encabezado */}
      <div className="absolute left-1/2 top-16 z-20 flex w-full -translate-x-1/2 flex-col items-center">
        <div className="mx-auto max-w-[950px] rounded-[2.5rem] bg-black/60 px-16 py-10 text-center shadow-2xl">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            Delicate Blooms Deserve
            <br />
            Gentle Hands
          </h1>
          <p className="mt-4 text-xl font-medium text-white">
            Flowers Are Delicate, So We Deliver Them
            <br />
            with Extra Care
          </p>
        </div>
      </div>

      {/* Tarjetas amarillas */}
      <div className="absolute bottom-0 left-0 z-30 flex w-full flex-row items-end justify-center gap-6 px-4 pb-8">
        {/* Tarjeta 1: Van */}
        <div className="relative flex w-[340px] min-h-[340px] flex-col items-center overflow-visible rounded-[3rem] bg-yellow-300 px-8 pb-8 pt-12 shadow-xl">
          {/* Imagen van centrada y sobresaliente */}
          <div className="relative z-10 flex flex-col items-center w-full justify-center">
            <Image
              src="/images/flowers/van.png"
              alt="Van"
              width={260}
              height={140}
              className="drop-shadow-xl"
              style={{ objectFit: 'contain', marginBottom: '-18px' }}
            />
          </div>
          <div className="w-full text-center">
            <div className="text-lg font-extrabold text-black">Reliable vehicle (car or van)</div>
            <ul className="mt-2 list-inside list-disc space-y-2 px-4 text-left text-base font-medium text-black">
              <li>GPS or navigation app (Google Maps, Waze)</li>
              <li>Cooler or climate control (if needed for hot weather)</li>
            </ul>
          </div>
        </div>
        {/* Tarjeta 2: Caja */}
        <div className="relative flex w-[340px] min-h-[340px] flex-col items-center overflow-visible rounded-[3rem] bg-yellow-300 px-8 pb-8 pt-12 shadow-xl">
          {/* Imagen caja centrada y medidas */}
          <div className="relative z-10 flex flex-col items-center w-full justify-center">
            <Image
              src="/images/flowers/boxes.png"
              alt="Storage Box"
              width={120}
              height={65}
              className="drop-shadow-xl"
              style={{ objectFit: 'contain', marginBottom: '-10px' }}
            />
            <div className="flex w-full flex-row justify-between gap-8">
              <span className="ml-2 text-xs font-bold text-black">23.46-in</span>
              <span className="mr-2 text-xs font-bold text-black">18.30-in</span>
            </div>
          </div>
          <div className="w-full text-center">
            <div className="text-lg font-extrabold text-black">Hefty 12gal Max Pro</div>
            <div className="mt-1 text-sm font-medium text-black">
              Storage Tote Gray: Plastic Utility Bin with Locking Handles & Latches,
              <br />
              Universal Storage Solution.
            </div>
          </div>
        </div>
        {/* Tarjeta 3: Maceta */}
        <div className="relative flex w-[340px] min-h-[340px] flex-col items-center overflow-visible rounded-[3rem] bg-yellow-300 px-8 pb-8 pt-12 shadow-xl">
          {/* Medidas y líneas arriba */}
          <div className="flex w-full flex-row justify-between px-8 mb-1">
            <div className="flex flex-col items-center">
              <span className="text-lg font-extrabold text-black">6.5"</span>
              <div className="h-12 w-px bg-black mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-extrabold text-black">6.7"</span>
              <div className="h-16 w-px bg-black mt-1"></div>
            </div>
          </div>
          {/* Imagen maceta centrada y dentro del contenedor */}
          <div className="relative z-10 flex flex-col items-center w-full justify-center">
            <Image
              src="/images/flowers/container.png"
              alt="Nursery Pot"
              width={70}
              height={90}
              className="drop-shadow-xl"
              style={{ objectFit: 'contain', marginBottom: '-10px' }}
            />
          </div>
          <div className="w-full text-center">
            <div className="text-lg font-extrabold text-black">RAOOKIF 1 Gallon Nursery Pots</div>
            <div className="mt-1 text-sm font-medium text-black">
              Flexible 1 Gallon Posts for Plants, 1 Gallon Plastic Plant Pots for Seedling, Cuttings, Succulents, Transplanting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelicateBlooms;
