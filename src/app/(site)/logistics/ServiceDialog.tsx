import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

// Define types for the service details
type ServiceDetail = {
  title: string;
  description: string;
  details: string[];
};

type ServiceDetailsType = {
  "Specialized Delivery": ServiceDetail;
  "Time-Critical Delivery": ServiceDetail;
  "Quality Guaranteed": ServiceDetail;
};

// Define the service names as a type
type ServiceName = keyof ServiceDetailsType;

// Define props interface
interface ServiceDialogProps {
  service: ServiceName;
  children: React.ReactNode;
}

// Define the content for each service
const serviceDetails: ServiceDetailsType = {
  "Specialized Delivery": {
    title: "Specialized Delivery Services",
    description: "Our specialized delivery service ensures your premium catering arrives in perfect condition.",
    details: [
      "Temperature-controlled vehicles maintain food quality",
      "Professionally trained handling staff",
      "Custom equipment for delicate items",
      "Real-time temperature monitoring",
      "Specialized packaging solutions"
    ]
  },
  "Time-Critical Delivery": {
    title: "Time-Critical Delivery Services",
    description: "When timing is everything, our precision delivery service ensures your event goes smoothly.",
    details: [
      "Guaranteed delivery windows",
      "Real-time GPS tracking",
      "Route optimization technology",
      "Backup delivery contingencies",
      "Live communication updates"
    ]
  },
  "Quality Guaranteed": {
    title: "Our Quality Guarantee",
    description: "Trusted by leading tech companies for our commitment to excellence and reliability.",
    details: [
      "100% satisfaction guarantee",
      "Industry-leading safety standards",
      "Certified food handling processes",
      "Insurance coverage included",
      "24/7 customer support"
    ]
  }
};

const ServiceDialog: React.FC<ServiceDialogProps> = ({ service, children }) => {
  const content = serviceDetails[service];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What we offer:</h3>
          <ul className="space-y-3">
            {content.details.map((detail, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <ChevronRight className="h-4 w-4 text-yellow-400 mr-2" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;