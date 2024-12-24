"use client";

import { FormType } from './QuoteRequest/types';

interface DeliveryFeature {
  title: string;
  description: string;
}

interface SpecialtyDeliveryProps {
  onRequestQuote?: (formType: FormType) => void;
}

const SpecialtyDelivery: React.FC<SpecialtyDeliveryProps> = ({ onRequestQuote }) => {
  const deliveryFeatures: DeliveryFeature[] = [
    {
      title: "Careful Handling",
      description: "Fragile goods, high-value items, and custom-sized packages are delivered with the utmost care."
    },
    {
      title: "On-Time Delivery",
      description: "Seasonal products, corporate gifts, and event materials are guaranteed to arrive when and where you need them."
    },
    {
      title: "Flexible Solutions",
      description: "We adapt to your schedule and provide tracking updates to keep you informed every step of the way."
    }
  ];

  const handleQuoteRequest = () => {
    if (onRequestQuote) {
      onRequestQuote("specialty");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Columna del contenido */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-yellow-400">
            Specialty Delivery
          </h2>
          
          <p className="text-gray-700">
            At <span className="font-bold">Ready Set Specialty Delivery</span>, we know that unique shipments require
            extra care and attention. From fragile goods to high-value items, we ensure
            that your deliveries are handled with precision and arrive on time. As one of
            the Bay Area package delivery service, we offer flexible solutions tailored to
            meet the specific needs of businesses with specialized logistics demands.
          </p>
          
          <p className="text-gray-700">
            Whether it's a parcel for your online store, a special delivery for a valued
            client, or recurring shipments, our services are designed to help your
            business grow by ensuring every delivery is smooth and reliable.
          </p>
          
          <div className="mt-8">
            <h3 className="text-lg italic mb-4">
              Our expertise in specialty delivery and logistics includes:
            </h3>
            
            <ul className="space-y-4">
              {deliveryFeatures.map((feature, index) => (
                <li key={index} className="flex gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-semibold">{feature.title}:</span>{" "}
                    {feature.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={handleQuoteRequest}
            className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition duration-200"
          >
            Request a Quote
          </button>
        </div>

        {/* Columna de la imagen */}
        <div className="mt-5 mb-10 max-w-md mx-auto"> {/* Agregué max-w-lg y mx-auto */}
         <img src="/images/logistics/specialtydeliverypic.png"
              alt="Specialty Delivery Service"
             className="w-full h-auto rounded-lg shadow-lg object-cover"/>
          </div>
        </div>
      </div>
  );
};

SpecialtyDelivery.displayName = 'SpecialtyDelivery';

export default SpecialtyDelivery;