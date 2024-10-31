import React from 'react';
import Link from "next/link";
import { Truck, Headphones, Users, LucideIcon } from "lucide-react";

interface ButtonLinkProps {
  href: string;
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, icon, title, description }) => {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 h-full">
        <div className="text-primary transition-colors duration-300 group-hover:text-primary-dark mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-center text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-300 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Ready Set Group LLC</h1>
        <p className="text-2xl text-gray-700">Choose your destination</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        <ButtonLink 
          href="/logistics" 
          icon={<Truck className="w-12 h-12" />}
          title="Logistics"
          description="Join our logistics team and be part of a dynamic supply chain network"
        />
        <ButtonLink 
          href="/va" 
          icon={<Headphones className="w-12 h-12" />}
          title="Virtual Assistant"
          description="Become a virtual assistant and work flexibly from anywhere"
        />
        <ButtonLink 
          href="/join-the-team" 
          icon={<Users className="w-12 h-12" />}
          title="Join the Team"
          description="Explore various exciting positions available in our growing company"
        />
      </div>
    </div>
  );
};

export default LandingPage;