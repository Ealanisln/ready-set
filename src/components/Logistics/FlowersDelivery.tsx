import React from 'react';
import Image from 'next/image';

interface DeliveryOccasion {
  title: string;
  description: string;
}

const FlowerDeliverySection = () => {
  const occasions: DeliveryOccasion[] = [
    {
      title: "Weddings & Anniversaries",
      description: "Perfect timing for wedding flowers, centerpieces, and floral décor.",
    },
    {
      title: "Valentine's Day",
      description: "Delivering love with roses and heartfelt arrangements.",
    },
    {
      title: "Mother's Day",
      description: "Ensuring every mom feels cherished with fresh and beautiful blooms.",
    },
    {
      title: "Graduations, Birthdays & Special Days",
      description: "Adding joy to celebrations with reliable floral delivery.",
    },
    {
      title: "Holiday Arrangements",
      description: "From Christmas poinsettias to festive wreaths, we deliver seasonal cheer.",
    },
  ];

  const partners = [
    "FTD", "Flower Shop Network", "Bloom Link", "H Bloom", 
    "Dove / Teleflora", "Lovingly", "Floom", "Bloom Nation"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="relative h-96 lg:h-full">
          <Image
            src="/api/placeholder/600/600"
            alt="Flower delivery person holding a beautiful bouquet"
            className="rounded-lg object-cover shadow-lg"
            fill
            priority
          />
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">
              Flowers Delivery
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Delivering More Than Flowers – We Deliver Emotions.
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              At <span className="font-semibold">Ready Set</span>, we know that 
              delivering flowers isn't just about logistics—it's about delivering 
              emotions, memories, and moments of joy.
            </p>

            <p className="text-gray-700">
              Whether it's a single bouquet of flowers or large-scale floral 
              shipments, we ensure every arrangement arrives fresh, intact, and 
              on schedule. Our services are designed to ensure smooth and reliable 
              flower delivery in the San Francisco Bay Area.
            </p>

            <p className="italic text-gray-600">
              From everyday deliveries to high-demand seasons, we handle 
              time-sensitive orders with care, especially for critical occasions like:
            </p>
          </div>

          {/* Occasions List */}
          <ul className="space-y-4">
            {occasions.map((occasion, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-yellow-400 font-bold">•</span>
                <div>
                  <span className="font-semibold">{occasion.title}</span>
                  <span className="text-gray-700"> – {occasion.description}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Partners Section */}
          <div className="space-y-4">
            <p className="text-gray-700">
              Our expertise in handling major floral industry platforms ensures a 
              smooth and hassle-free delivery process, including{' '}
              <span className="italic">
                {partners.slice(0, -1).join(', ')} and {partners[partners.length - 1]}
              </span>
              . We also partner with local flower shops to bring you the best 
              floral delivery experience.
            </p>
          </div>

          {/* CTA Button */}
          <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-md 
            font-semibold hover:bg-yellow-500 transition-colors duration-200">
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerDeliverySection;