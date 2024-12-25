"use client";

import { FormType } from './QuoteRequest/types';

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
  return text.replace(
    /At (Ready Set),/,
    'At <strong>$1</strong>,'
  ).split(/<strong>|<\/strong>/).map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
  );
};

const formatFinalNote = (text: string) => {
  return text.replace(
    /(Ready Set) is/,
    '<strong>$1</strong> is'
  ).split(/<strong>|<\/strong>/).map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
  );
};

const formatPartnerName = (name: string) => {
  const terms = [
    'Foodee',
    'Destino',
    'Guerilla Catering SF',
    'Conviva',
    'Korean Bobcha'
  ];
  
  return terms.includes(name) ? 
    <strong className="font-bold">{name}</strong> : 
    name;
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
      <div className="mx-auto max-w-7xl px-8 md:px-16 mb-8">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">{title}</h1>
        <p className="text-gray-700 italic text-center max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Main Content - Yellow Box */}
      <div className="w-full bg-amber-300">
        <div className="mx-auto max-w-7xl px-8 md:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">Food Deliveries</h2>
                <p className="text-gray-700">{formatDescription(description)}</p>
                <p className="text-gray-700">{longDescription}</p>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Our Food Delivery Partners</h3>
                  <p className="text-gray-700">We're proud to collaborate with some of the top names in the industry:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {partners.map((partner, index) => (
                      <li key={index} className="text-gray-700 italic">
                        {formatPartnerName(partner.name)}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-gray-700 italic">{formatFinalNote(finalNote)}</p>

                <button 
                  onClick={handleQuoteRequest}
                  className="bg-white px-6 py-3 rounded-md font-bold text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative h-full mt-20 min-h-[300px] max-h-[500px] lg:min-h-0 flex items-center">
           <div className="rounded-3xl  overflow-hidden h-full w-full">
           <img src="/images/logistics/foodpic.png" alt="Food delivery containers with various meals"
            className="w-full h-full object-cover"/>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodServices;