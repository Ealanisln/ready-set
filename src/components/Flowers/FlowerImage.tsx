import Image from "next/image";
import React from "react";

interface FlowerImageProps {
  src?: string;
  alt?: string;
}

const FlowerImage: React.FC<FlowerImageProps> = ({
  src = "/images/flowers/flower1.jpg",
  alt = "Un hermoso arreglo floral entregado por Ready Set",
}) => {
  return (
    <div className="w-full h-auto flex justify-end items-center">
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        width={2000}
        height={1600}
        style={{
          objectFit: "contain",
        }}
        sizes="100vw"
        priority
        className="object-contain w-full h-auto scale-150 md:scale-[1.7] lg:scale-[2] max-w-none"
      />
    </div>
  );
};

export default FlowerImage;
