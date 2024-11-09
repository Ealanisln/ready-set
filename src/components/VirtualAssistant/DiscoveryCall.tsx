import Image from "next/image";
import React from "react";
import AppointmentDialog from "./Appointment";

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
        "Book a discovery call today to discuss your business and see how our virtual assistant services can help.",
    },
    {
      number: 2,
      title: "Customized Service Plan",
      description:
        "We'll create a tailored plan to connect you with the right assistance and tools to efficient task management, so you can focus on growth.",
    },
    {
      number: 3,
      title: "Enjoy Enhaced Productivity",
      description:
        "With your virtual assistant team, experience greater productivity and more time for what truly matters.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Section */}
        <div className="w-full rounded-3xl bg-amber-300 p-8 md:w-1/2">
          <h2 className="mb-8 text-2xl font-extrabold">
            Getting started with Virtual Assistant Services
          </h2>

          <div className="space-y-8">
            {steps.map((step) => (
              <Step key={step.number} {...step} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <AppointmentDialog
              buttonVariant="black"
              calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2">
          <div className="h-full w-full overflow-hidden rounded-3xl bg-gray-100">
            <picture>
              <source
                srcSet="/images/virtual/discovery-call.webp"
                type="image/webp"
              />
              <Image
                src="/images/virtual/discovery-call.jpg"
                alt="Business professional with laptop"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="w-full rounded-3xl bg-black p-12">
        <h2 className="text-center text-lg font-medium text-yellow-400 md:text-2xl">
          We&apos;ve provided over{" "}
          <span className="font-bold">
            50,000 project hours dedicated to growing successful businesses!
          </span>
        </h2>
      </div>
    </div>
  );
};

export default GettingStartedSection;
