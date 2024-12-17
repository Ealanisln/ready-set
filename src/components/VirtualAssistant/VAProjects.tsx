import React from 'react';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: "Admin",
    description: "Efficient management of calendars, emails, and data entry tasks.",
  },
  {
    title: "Customer Service & Sales",
    description: "Provide your clients with timely and professional support.",
  },
  {
    title: "Design & Editing",
    description: "Plan, create, and post content to grow your online presence.",
  },
  {
    title: "Social Media",
    description: "Manage posts, schedule content, and engage with your audience.",
  },
  {
    title: "Web Development",
    description: "Build and optimize websites for seamless user experiences",
  },
  {
    title: "Incoming Services",
    description: "Too be announced.",
  }
];

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description }) => (
  <Card className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow duration-300">
    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
      {/* Placeholder for service icon */}
      <div className="w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
    </div>
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <button className="px-6 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors duration-300">
      more
    </button>
  </Card>
);

const VirtualAssistantProjects = () => {
  return (
    <div className="min-h-screen bg-yellow-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">
            Virtual Assistant Projects
          </h1>
          <p className="text-xl text-black">
            Purchase blocks of hours whenever you need an assistant to get the job done
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={<></>}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gray-800 text-white rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors duration-300 flex items-center mx-auto space-x-2">
            <span>BOOK A DISCOVERY CALL</span>
            <span className="inline-block transform -rotate-45">👆</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualAssistantProjects;