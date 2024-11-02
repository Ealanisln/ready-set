import Image from "next/image";
import React from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex items-start gap-6">
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black">
      <span className="text-xl font-bold text-white">{number}</span>
    </div>
    <div className="flex-1">
      <h3 className="mb-2 text-2xl font-bold">{title}</h3>
      <p className="leading-relaxed text-gray-700">{description}</p>
    </div>
  </div>
);

const GettingStartedSection = () => {
  const steps: StepProps[] = [
    {
      number: 1,
      title: "Discovery Call",
      description:
        "Book a Discovery Call with us today so we can analyse your current business set-up, and see how we can help.",
    },
    {
      number: 2,
      title: "Systemise & Scale Up",
      description:
        "We'll create and implement a personalised Systemise & Scale Up plan to streamline your processes with the right digital tools and Virtual Assistants.",
    },
    {
      number: 3,
      title: "Enjoy freedom",
      description:
        "Once implementation is complete, we'll even train your virtual assistants on all your new systems and processes so you can enjoy your freedom!",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Section */}
        <div className="w-full rounded-3xl bg-amber-300 p-8 md:w-1/2">
          <h2 className="mb-8 text-4xl font-bold">
            Getting started is <span className="font-black">easy</span>
          </h2>

          <div className="space-y-8">
            {steps.map((step) => (
              <Step key={step.number} {...step} />
            ))}
          </div>

          <button className="mt-8 rounded-full bg-black px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-gray-800">
            BOOK A DISCOVERY CALL
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2">
          <div className="h-full w-full overflow-hidden rounded-3xl bg-gray-100">
            <Image
              src="/images/virtual/discovery-call.jpg"
              alt="Business professional with laptop"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="w-full rounded-3xl bg-emerald-500 p-12">
        <h2 className="text-center text-lg font-medium text-white md:text-2xl">
          We&apos;ve helped <span className="font-bold">500+ companies</span>{" "}
          regain at least <span className="font-bold">20 hours per week.</span>
        </h2>
      </div>
    </div>
  );
};

export default GettingStartedSection;
