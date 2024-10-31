"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, Clock, Shield, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LogisticsServices() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative bg-gradient-to-r from-yellow-50 to-gray-50">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative container mx-auto px-4 pt-32 pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Premium Catering Logistics Services
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Bay Area&apos;s Most Trusted Catering Delivery Partner Since 2019
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-6">
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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="w-12 h-12 text-yellow-400" />,
                title: "Specialized Delivery",
                description: "Expert handling of your premium catering needs with temperature-controlled vehicles and trained professionals."
              },
              {
                icon: <Clock className="w-12 h-12 text-yellow-400" />,
                title: "Time-Critical Delivery",
                description: "Guaranteed on-time delivery for your events with real-time tracking and dedicated route optimization."
              },
              {
                icon: <Shield className="w-12 h-12 text-yellow-400" />,
                title: "Quality Guaranteed",
                description: "Trusted by leading tech companies including Apple, Google, Facebook, and Netflix for reliable service."
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">{service.icon}</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 group-hover:translate-x-2 transition-transform">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Ready Set?</h2>
            <p className="text-xl text-gray-600">
              The Bay Area&apos;s premier specialized catering logistics provider
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Specialized temperature control equipment",
              "Professional handling protocols",
              "Experienced delivery team",
              "Real-time tracking system"
            ].map((feature, index) => (
              <div key={index} className="flex items-center bg-white p-6 rounded-lg shadow-md">
                <Check className="w-6 h-6 text-yellow-400 mr-4 flex-shrink-0" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Request a Quote
              </h2>
              {formSubmitted ? (
                <div className="text-center p-8">
                  <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-700">
                    Thank you for your interest! We&apos;ll contact you shortly with a custom quote.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input type="text" placeholder="Company Name" required className="w-full" />
                  <Input type="text" placeholder="Contact Person" required className="w-full" />
                  <Input type="email" placeholder="Business Email" required className="w-full" />
                  <Input type="tel" placeholder="Phone Number" required className="w-full" />
                  <Textarea 
                    placeholder="Tell us about your catering delivery needs" 
                    required 
                    className="w-full min-h-[120px]"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-6"
                  >
                    Get Quote
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
