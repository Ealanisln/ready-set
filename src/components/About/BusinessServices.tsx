import Image from "next/image";
import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  imagePath: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imagePath,
}) => (
  <div className="flex flex-col items-center space-y-4 rounded-2xl bg-white p-8 text-center">
    <div className="relative flex h-20 w-20 items-center justify-center">
      <Image
        src={imagePath}
        alt={title}
        fill
        sizes="(max-width: 80px) 100vw"
        className="object-contain"
      />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BusinessServices = () => {
  const services = [
    {
      title: "Your Business, Simplified",
      description:
        "We're the team that's got your back. From expert catering delivery to top-notch virtual assistants, we've got the solutions to help your business thrive.",
      imagePath: "/images/about/1.png",
    },
    {
      title: "Adapting to Win.",
      description:
        "We started as a leading catering delivery service, serving tech giants like Apple and Google. When the pandemic hit, we pivoted, partnering with flower shops and launching our virtual assistant service. Now, we help businesses of all sizes streamline operations and achieve their goals.",
      imagePath: "/images/about/2.png",
    },
    {
      title: "Your Virtual Workforce.",
      description:
        "Need an extra pair of hands? Our skilled virtual assistants can handle everything from email management to sales outreach. Let us take care of the busy work, so you can focus on what matters most.",
      imagePath: "/images/about/3.png",
    },
  ];

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <section className="mx-auto max-w-[1400px] rounded-3xl bg-yellow-300 p-8 md:p-12 lg:p-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
            Ready Set: More than just delivery logistics. Your partner in
            business growth, powered by virtual expertise.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                imagePath={service.imagePath}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessServices;