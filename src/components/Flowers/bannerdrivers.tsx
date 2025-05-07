import React from "react";

interface DeliveryBannerProps {
  title?: string;
  subtitle?: string;
}

const DeliveryBanner: React.FC<DeliveryBannerProps> = ({
  title = "Already Have Delivery Drivers?",
  subtitle = "Let Us Handle Your Backend Admin.",
}) => {
  return (
    <div className="w-full rounded-md border-[4px] border-dashed border-yellow-400 px-4 py-6">
      <h2 className="mb-1 text-center text-4xl font-bold text-gray-800 md:text-5xl">
        {title}
      </h2>
      <h3 className="text-center text-4xl font-bold text-gray-800 md:text-5xl">
        {subtitle}
      </h3>
    </div>
  );
};

export default DeliveryBanner;
