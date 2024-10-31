import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex gap-6 items-start">
    <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
      <span className="text-white text-xl font-bold">{number}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  </div>
);

const GettingStartedSection = () => {
  const steps: StepProps[] = [
    {
      number: 1,
      title: "Discovery Call",
      description: "Book a Discovery Call with us today so we can analyse your current business set-up, and see how we can help."
    },
    {
      number: 2,
      title: "Systemise & Scale Up",
      description: "We'll create and implement a personalised Systemise & Scale Up plan to streamline your processes with the right digital tools and Virtual Assistants."
    },
    {
      number: 3,
      title: "Enjoy freedom",
      description: "Once implementation is complete, we'll even train your virtual assistants on all your new systems and processes so you can enjoy your freedom!"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-amber-300 rounded-3xl p-8">
          <h2 className="text-4xl font-bold mb-8">
            Getting started is <span className="font-black">easy</span>
          </h2>
          
          <div className="space-y-8">
            {steps.map((step) => (
              <Step key={step.number} {...step} />
            ))}
          </div>

          <button className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors">
            BOOK A DISCOVERY CALL
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-100">
            <img
              src="/api/placeholder/800/800"
              alt="Business professional with laptop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="w-full bg-emerald-500 rounded-3xl p-12">
        <h2 className="text-white text-center text-lg md:text-2xl font-medium">
          We&apos;ve helped <span className="font-bold">500+ companies</span> regain at least <span className="font-bold">20 hours per week.</span>
        </h2>
      </div>
    </div>
  );
};

export default GettingStartedSection;