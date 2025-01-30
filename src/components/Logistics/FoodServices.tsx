"use client";

import { FormType } from "./QuoteRequest/types";

interface Partner {
  name: string;
}

interface FoodServicesProps {
  onRequestQuote?: (formType: FormType) => void;
  title?: string;
  subtitle?: string;
  description?: string;
  longDescription?: string;
  partners?: Partner[];
  finalNote?: string;
}

const formatDescription = (text: string) => {
  return text
    .replace(/At (Ready Set),/, "At <strong>$1</strong>,")
    .split(/<strong>|<\/strong>/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
};

const formatFinalNote = (text: string) => {
  return text
    .replace(/(Ready Set) is/, "<strong>$1</strong> is")
    .split(/<strong>|<\/strong>/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
};

const formatPartnerName = (name: string) => {
  const terms = [
    "Foodee",
    "Destino",
    "Guerilla Catering SF",
    "Conviva",
    "Korean Bobcha",
  ];

  return terms.includes(name) ? (
    <strong className="font-bold">{name}</strong>
  ) : (
    name
  );
};

const FoodServices: React.FC<FoodServicesProps> = ({
  onRequestQuote,
  title = "OUR SERVICES",
  subtitle = "With Ready Set, you can trust your delivery needs are handled with precision and professionalism. Let's keep your business moving—fresh, fast, and on time.",
  description = "At Ready Set, we redefine food delivery services to cater to your business needs. As a trusted logistics partner in the food industry, we specialize in delivering fresh, high-quality, and perishable goods right on time and in pristine condition. Whether you're searching for the best food delivery service for your business or need reliable solutions, we've got you covered.",
  longDescription = "From seamless breakfast delivery near me to dependable business lunch logistics, Ready Set ensures every order is handled with care and precision. Our expertise spans food drives, restaurant deliveries, and specialty food logistics, making us the ultimate choice for businesses seeking top-notch delivery solutions.",
  partners = [
    { name: "Foodee" },
    { name: "Destino" },
    { name: "Guerilla Catering SF" },
    { name: "Conviva" },
    { name: "Korean Bobcha" },
  ],
  finalNote = "Ready Set is the go-to choice for foodies and businesses alike. Whether it's a bustling restaurant or a corporate event, we deliver more than just meals; we deliver satisfaction.",
}) => {
  const handleQuoteRequest = () => {
    if (onRequestQuote) {
      onRequestQuote("food");
    }
  };

  return (
    <div className="w-full" id="food-services">
      {/* Title Section - Outside the yellow box */}
      <div className="mx-auto mb-8 max-w-7xl px-8 md:px-16">
        <h1 className="mb-4 text-center text-5xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-center italic text-gray-700">
          {subtitle}
        </p>
      </div>

      {/* Main Content - Yellow Box */}
      <div className="w-full bg-amber-300">
        <div className="mx-auto max-w-7xl px-8 py-12 md:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">
                  Food Deliveries
                </h2>
                <p className="text-gray-700">
                  {formatDescription(description)}
                </p>
                <p className="text-gray-700">{longDescription}</p>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Our Food Delivery Partners
                  </h3>
                  <p className="text-gray-700">
                    We're proud to collaborate with some of the top names in the
                    industry:
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    {partners.map((partner, index) => (
                      <li key={index} className="italic text-gray-700">
                        {formatPartnerName(partner.name)}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="italic text-gray-700">
                  {formatFinalNote(finalNote)}
                </p>

                <button
                  onClick={handleQuoteRequest}
                  className="rounded-md bg-white px-6 py-3 font-bold text-gray-800 transition-colors hover:bg-gray-100"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="w-full px-4 md:px-6 lg:px-8">
              <div className="relative mt-8 w-full md:mt-12 lg:mt-20">
                <div className="aspect-w-16 aspect-h-9 md:aspect-h-10 lg:aspect-h-7">
                  <div className="h-full w-full overflow-hidden rounded-3xl">
                    <picture>
                      <source
                        srcSet="/images/logistics/foodpic.webp"
                        type="image/webp"
                      />
                      <img
                        src="/images/logistics/foodpic.png"
                        alt="Food delivery containers with various meals"
                        className="h-full w-full object-cover object-center"
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodServices;
