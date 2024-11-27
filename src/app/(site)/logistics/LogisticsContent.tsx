// components/Logistics/LogisticsContent.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Truck, Clock, Shield, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteRequestForm } from "@/components/Logistics/QuoteRequestForm";
import ServiceDialog from "./ServiceDialog";
import { ServiceName } from "./types";

export default function LogisticsContent() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

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
      {/* Hidden SEO content */}
      <div
        className="sr-only"
        role="complementary"
        aria-label="Logistics Services Overview"
      >
        <h1>Premium Catering Logistics Services - Ready Set Group LLC</h1>
        <p>
          Ready Set Group LLC has been the Bay Area&apos;s premier catering logistics
          provider since 2019, delivering excellence to Silicon Valley&apos;s most
          prestigious companies. Our specialized delivery services combine
          state-of-the-art temperature control with professional handling to
          ensure your catering arrives in perfect condition.
        </p>

        <div role="navigation" aria-label="Core Services">
          <h2>Comprehensive Logistics Solutions</h2>
          <ul>
            <li>
              <h3>Temperature-Controlled Fleet</h3>
              <p>
                Our specialized fleet maintains optimal temperature throughout
                transit, ensuring food quality and safety for corporate catering
                deliveries. Each vehicle is equipped with advanced monitoring
                systems and follows strict sanitization protocols.
              </p>
            </li>
            <li>
              <h3>Professional Handling</h3>
              <p>
                Our trained logistics team specializes in handling premium
                catering items, following detailed protocols for loading,
                transport, and delivery. We maintain food safety certification
                and HACCP compliance throughout the delivery process.
              </p>
            </li>
            <li>
              <h3>Time-Critical Delivery</h3>
              <p>
                Utilizing advanced route optimization and real-time tracking, we
                guarantee punctual delivery for your corporate events. Our
                dedicated dispatch team monitors each delivery to ensure timely
                arrival and proper handling.
              </p>
            </li>
          </ul>
        </div>

        <div role="contentinfo" aria-label="Service Excellence">
          <h2>Industry Leadership</h2>
          <p>
            Trusted by Silicon Valley giants including Apple, Google, Facebook,
            and Netflix, our logistics services set the standard for corporate
            catering delivery. We maintain a 99.9% on-time delivery rate while
            ensuring food safety and quality.
          </p>

          <h3>Key Advantages</h3>
          <ul>
            <li>Advanced temperature monitoring systems</li>
            <li>Professional handling protocols</li>
            <li>Real-time delivery tracking</li>
            <li>Dedicated account management</li>
            <li>Flexible scheduling options</li>
            <li>Comprehensive insurance coverage</li>
            <li>Emergency response protocols</li>
            <li>Sustainable delivery practices</li>
          </ul>

          <h3>Service Areas</h3>
          <p>
            Serving the entire Bay Area including San Francisco, Silicon Valley,
            San Jose, Oakland, and surrounding communities. Specialized in
            corporate campus deliveries, tech office complexes, and large-scale
            event venues.
          </p>
        </div>
      </div>

      {/* Existing visual content */}
      <div className="relative bg-gradient-to-r from-yellow-50 to-gray-50">
        {/* Rest of your existing JSX code... */}
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