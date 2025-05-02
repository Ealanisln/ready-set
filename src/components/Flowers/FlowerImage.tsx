import Image from 'next/image';
import React from 'react';

interface FlowerImageProps {
  src?: string;
  alt?: string;
}

const FlowerImage: React.FC<FlowerImageProps> = ({
  src = '/images/flowers/flower1.png',
  alt = 'Un hermoso arreglo floral entregado por Ready Set',
}) => {
  return (
    <div className="flex h-auto w-full items-center justify-end">
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        width={2000}
        height={1600}
        style={{
          objectFit: 'contain',
        }}
        sizes="100vw"
        priority
        className="h-auto w-full max-w-none scale-150 object-contain md:scale-[1.7] lg:scale-[2]"
      />
    </div>
  );
};

export default FlowerImage;
