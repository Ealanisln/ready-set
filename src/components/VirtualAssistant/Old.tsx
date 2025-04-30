import React from "react";
import Image from "next/image";
import { Briefcase, Phone, Calendar, FileText, BarChart2 } from "lucide-react";
interface ServiceSectionProps {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  imageSrc: string;
  imagePosition: "left" | "right";
}
const ServiceSection: React.FC<ServiceSectionProps> = ({
  title,
  description,
  icon,
  imageSrc,
  imagePosition,
}) => (
  <div className="mb-16">
    <div
      className={`flex flex-wrap items-center ${imagePosition === "right" ? "flex-row-reverse" : ""}`}
    >
      <div className="mb-6 w-full lg:mb-0 lg:w-3/5">
        <div className={`${imagePosition === "right" ? "lg:pr-8" : "lg:pl-8"}`}>
          <div className="mb-4 flex items-center">
            {icon}
            <h2 className="ml-2 text-2xl font-semibold">{title}</h2>
          </div>
          {description}
        </div>
      </div>
      <div className="w-full p-4 lg:w-2/5">
        <div className="relative h-[250px] lg:h-[300px]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="rounded-lg object-cover object-center"
          />
        </div>
      </div>
    </div>
  </div>
);
const ReadySetVirtualAssistantPage: React.FC = () => {
  const services: ServiceSectionProps[] = [
    {
      title: "Administrative Support",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      description: (
        <>
          <p className="mb-4">
            Our virtual assistants excel in handling a wide range of
            administrative tasks:
          </p>
          <ul className="mb-4 list-disc pl-5">
            <li>Email management and correspondence</li>
            <li>Calendar scheduling and organization</li>
            <li>Data entry and database management</li>
            <li>File organization and document preparation</li>
            <li>Travel arrangements and itinerary planning</li>
          </ul>
        </>
      ),
      imageSrc: "/images/virtual/administrative-support.jpg",
      imagePosition: "right",
    },
    {
      title: "Customer Service",
      icon: <Phone className="h-8 w-8 text-green-500" />,
      description: (
        <>
          <p className="mb-4">
            Enhance your customer experience with our dedicated virtual customer
            service:
          </p>
          <ul className="mb-4 list-disc pl-5">
            <li>Responding to customer inquiries via email, chat, or phone</li>
            <li>Managing and resolving customer complaints</li>
            <li>Processing orders and handling returns</li>
            <li>Maintaining customer databases</li>
            <li>Providing product information and support</li>
          </ul>
        </>
      ),
      imageSrc: "/images/virtual/customer-service.jpg",
      imagePosition: "left",
    },
    {
      title: "Appointment Scheduling",
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      description: (
        <>
          <p className="mb-4">
            Streamline your scheduling process with our efficient appointment
            management:
          </p>
          <ul className="mb-4 list-disc pl-5">
            <li>Managing and coordinating appointments</li>
            <li>Sending reminders to clients and team members</li>
            <li>Handling rescheduling and cancellations</li>
            <li>Integrating with various scheduling software</li>
            <li>Providing schedule summaries and reports</li>
          </ul>
        </>
      ),
      imageSrc: "/images/virtual/appointment-scheduling.jpg",
      imagePosition: "right",
    },
    {
      title: "Content Creation and Management",
      icon: <FileText className="h-8 w-8 text-yellow-500" />,
      description: (
        <>
          <p className="mb-4">
            Boost your online presence with our content creation and management
            services:
          </p>
          <ul className="mb-4 list-disc pl-5">
            <li>Writing and editing blog posts</li>
            <li>Creating social media content</li>
            <li>Designing basic graphics and infographics</li>
            <li>Managing content calendars</li>
            <li>Updating website content</li>
          </ul>
        </>
      ),
      imageSrc: "/images/virtual/content-creation.jpg",
      imagePosition: "left",
    },
    {
      title: "Research and Analysis",
      icon: <BarChart2 className="h-8 w-8 text-red-500" />,
      description: (
        <>
          <p className="mb-4">
            Gain valuable insights with our research and analysis support:
          </p>
          <ul className="mb-4 list-disc pl-5">
            <li>Conducting market research</li>
            <li>Competitor analysis</li>
            <li>Data collection and compilation</li>
            <li>Preparing research reports and presentations</li>
            <li>Trend analysis and forecasting</li>
          </ul>
        </>
      ),
      imageSrc: "/images/virtual/research-analysis.jpg",
      imagePosition: "right",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="mb-8 pt-8 text-center text-4xl font-bold">
        Ready Set Virtual Assistant Services
      </h1>
      <div className="mb-8 flex justify-center">
        <a
          href="/apply"
          className="inline-block rounded bg-green-500 px-12 py-4 text-white transition-colors hover:bg-green-600"
        >
          Join the team
        </a>
      </div>
      <div className="mb-16 flex flex-wrap items-center">
        <div className="mb-8 w-full lg:mb-0 lg:w-1/2">
          <p className="mb-6 text-lg">
            ReadySet offers comprehensive virtual assistant solutions designed
            to streamline your operations and enhance productivity. Our services
            cover a wide range of tasks, allowing you to focus on growing your
            business.
          </p>
          <p className="mb-6 text-lg">
            With over 5 years of experience, we&apos;re your dedicated partner
            for handling day-to-day operations, customer service, and
            administrative tasks. Whether you need ongoing support or help with
            specific projects, we&apos;ve got you covered.
          </p>
          <p className="text-lg font-semibold">
            Empowering Businesses Across the San Francisco Bay Area and Austin,
            TX.
          </p>
        </div>
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="relative h-[300px] lg:h-[400px]">
            <Image
              src="/images/virtual/header.jpg"
              alt="ReadySet Virtual Assistant Team"
              fill
              className="rounded-lg object-cover object-center"
            />
          </div>
        </div>
      </div>
      {services.map((service, index) => (
        <ServiceSection key={index} {...service} />
      ))}
    </div>
  );
};
export default ReadySetVirtualAssistantPage;