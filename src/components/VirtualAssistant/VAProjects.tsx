import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import AppointmentDialog from "./Appointment";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

interface Service {
  title: string;
  description: string;
  imageUrl: string;
}

const services: Service[] = [
  {
    title: "Admin",
    description:
      "Efficient management of calendars, emails, and data entry tasks.",
    imageUrl: "/images/virtual/projects/1.png",
  },
  {
    title: "Customer Service & Sales",
    description: "Provide your clients with timely and professional support.",
    imageUrl: "/images/virtual/projects/2.png",
  },
  {
    title: "Design & Editing",
    description: "Plan, create, and post content to grow your online presence.",
    imageUrl: "/images/virtual/projects/3.png",
  },
  {
    title: "Social Media",
    description:
      "Manage posts, schedule content, and engage with your audience.",
    imageUrl: "/images/virtual/projects/4.png",
  },
  {
    title: "Web Development",
    description: "Build and optimize websites for seamless user experiences",
    imageUrl: "/images/virtual/projects/5.png",
  },
  {
    title: "Custom Requests",
    description: "Didn't find the service you need? We can help.",
    imageUrl: "/images/virtual/projects/6.png",
  },
];

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  const isCustomRequest = title === "Custom Requests";
  const buttonText = title === "Custom Requests" ? "Let's talk" : "more";

  return (
    <div className="relative h-64 w-full md:h-72 lg:h-80 xl:h-96">
      {/* Image Container */}
      <div className="absolute left-0 top-1/2 z-10 h-28 w-28 -translate-x-4 -translate-y-1/2 transition-all duration-300 md:h-32 md:w-32 md:-translate-x-6 lg:h-40 lg:w-40 lg:-translate-x-8 xl:h-48 xl:w-48 xl:-translate-x-12">
        <Image
          src={imageUrl}
          alt={title}
          width={208}
          height={208}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Card Container */}
      <Card className="absolute inset-0 rounded-lg bg-white pl-24 pr-4 shadow-lg transition-shadow duration-300 hover:shadow-xl md:pl-28 md:pr-4 lg:pl-36 lg:pr-5 xl:pl-44 xl:pr-6">
        <div className="relative flex h-full flex-col">
          {/* Content Section */}
          <div className="flex-grow pt-6 md:pt-8 lg:pt-10">
            <h3 className="mb-2 text-right text-lg font-bold text-gray-800 md:mb-3 md:text-lg lg:mb-4 lg:text-xl xl:text-2xl">
              {title}
            </h3>
            <p className="text-right text-sm leading-snug text-gray-600 md:text-sm lg:text-base xl:text-lg">
              {description}
            </p>
          </div>

          {/* Button Section - Fixed to bottom */}
          <div className="pb-6 md:pb-8 lg:pb-10">
            <div className="flex justify-end">
              {isCustomRequest ? (
                <AppointmentDialog
                  buttonText={buttonText}
                  buttonClassName="rounded-full bg-amber-300 px-4 py-1.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-yellow-500 md:px-5 md:py-2 lg:px-6 lg:py-2 xl:px-8 xl:text-base"
                  calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true"
                  buttonIcon={null}
                  dialogTitle="Schedule a Custom Request Discussion"
                  dialogDescription="Choose a time to discuss your custom project needs."
                />
              ) : (
                <button className="rounded-full bg-amber-300 px-4 py-1.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-yellow-500 md:px-5 md:py-2 lg:px-6 lg:py-2 xl:px-8 xl:text-base">
                  {buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function VirtualAssistantProjects() {
  return (
    <div className="min-h-screen bg-amber-300 px-4 py-8 md:px-5 md:py-12 lg:px-6 lg:py-16 xl:px-8 xl:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center md:mb-12 lg:mb-16 xl:mb-20">
          <h1 className="mb-3 text-3xl font-bold text-black md:mb-4 md:text-3xl lg:mb-5 xl:mb-6 xl:text-4xl">
            Virtual Assistant Projects
          </h1>
          <p className="text-lg text-black md:text-lg lg:text-lg xl:text-xl">
            Purchase blocks of hours whenever you need an assistant to get the
            job done
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:gap-8 xl:grid-cols-3 xl:gap-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center md:mt-12 lg:mt-16 xl:mt-20">
          <AppointmentDialog
            buttonVariant="black"
            calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true" 
          />
        </div>
      </div>
    </div>
  );
}