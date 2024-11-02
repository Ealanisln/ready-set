// src/app/(site)/logistics/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import sendEmail from "@/app/actions/email";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, Clock, Shield, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuoteRequestForm } from "@/components/Logistics/QuoteRequestForm";

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

type ServiceName = keyof ServiceDetailsType;

interface ServiceDialogProps {
  service: ServiceName;
  children: React.ReactNode;
}

// Service details content
const serviceDetails: ServiceDetailsType = {
  "Specialized Delivery": {
    title: "Specialized Delivery Services",
    description:
      "Our specialized delivery service ensures your premium catering arrives in perfect condition.",
    details: [
      "Temperature-controlled vehicles maintain food quality",
      "Professionally trained handling staff",
      "Custom equipment for delicate items",
      "Real-time temperature monitoring",
      "Specialized packaging solutions",
    ],
  },
  "Time-Critical Delivery": {
    title: "Time-Critical Delivery Services",
    description:
      "When timing is everything, our precision delivery service ensures your event goes smoothly.",
    details: [
      "Guaranteed delivery windows",
      "Real-time GPS tracking",
      "Route optimization technology",
      "Backup delivery contingencies",
      "Live communication updates",
    ],
  },
  "Quality Guaranteed": {
    title: "Our Quality Guarantee",
    description:
      "Trusted by leading tech companies for our commitment to excellence and reliability.",
    details: [
      "100% satisfaction guarantee",
      "Industry-leading safety standards",
      "Certified food handling processes",
      "Insurance coverage included",
      "24/7 customer support",
    ],
  },
};

// ServiceDialog Component
const ServiceDialog: React.FC<ServiceDialogProps> = ({ service, children }) => {
  const content = serviceDetails[service];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {content.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-lg text-gray-600">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            What we offer:
          </h3>
          <ul className="space-y-3">
            {content.details.map((detail, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <ChevronRight className="mr-2 h-4 w-4 text-yellow-400" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function LogisticsServices() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Define services with proper typing
  const services: Array<{
    icon: React.ReactNode;
    title: ServiceName;
    description: string;
  }> = [
    {
      icon: <Truck className="h-12 w-12 text-yellow-400" />,
      title: "Specialized Delivery",
      description:
        "Expert handling of your premium catering needs with temperature-controlled vehicles and trained professionals.",
    },
    {
      icon: <Clock className="h-12 w-12 text-yellow-400" />,
      title: "Time-Critical Delivery",
      description:
        "Guaranteed on-time delivery for your events with real-time tracking and dedicated route optimization.",
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-400" />,
      title: "Quality Guaranteed",
      description:
        "Trusted by leading tech companies including Apple, Google, Facebook, and Netflix for reliable service.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative bg-gradient-to-r from-yellow-50 to-gray-50">
        <div className="absolute inset-0 bg-black/5" />
        <div className="container relative mx-auto px-4 pb-24 pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900">
              Premium Catering Logistics Services
            </h1>
            <p className="mb-8 text-xl text-gray-700">
              Bay Area&apos;s Most Trusted Catering Delivery Partner Since 2019
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-yellow-400 px-8 py-6 text-gray-800 hover:bg-yellow-500">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-8">
                  <div className="mb-6">{service.icon}</div>
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                    {service.title}
                  </h2>
                  <p className="mb-6 text-gray-600">{service.description}</p>
                  <ServiceDialog service={service.title}>
                    <Button className="bg-yellow-400 text-gray-800 transition-transform hover:bg-yellow-500 group-hover:translate-x-2">
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </ServiceDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              Why Choose Ready Set?
            </h2>
            <p className="text-xl text-gray-600">
              The Bay Area&apos;s premier specialized catering logistics
              provider
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              "Specialized temperature control equipment",
              "Professional handling protocols",
              "Experienced delivery team",
              "Real-time tracking system",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white p-6 shadow-md"
              >
                <Check className="mr-4 h-6 w-6 flex-shrink-0 text-yellow-400" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
     <QuoteRequestForm />
    </div>
  );
}
