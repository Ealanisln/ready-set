'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Plan {
  hours: number;
  pricePerHour: number;
  name: string;
  features: string[];
}

const VaHoursSeller = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    router.push(`/sales/book?plan=${encodeURIComponent(planName)}`);
  };

  const plans: Plan[] = [
    {
      hours: 20,
      pricePerHour: 35,
      name: "Starter",
      features: [
        "General Admin Support",
        "Email Management",
        "Calendar Management",
        "Basic Data Entry"
      ]
    },
    {
      hours: 40,
      pricePerHour: 32,
      name: "Professional",
      features: [
        "All Starter Features",
        "Social Media Management",
        "Customer Support",
        "Process Documentation"
      ]
    },
    {
      hours: 80,
      pricePerHour: 29,
      name: "Enterprise",
      features: [
        "All Professional Features",
        "Project Management",
        "Team Coordination",
        "Strategic Planning Support"
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Virtual Assistant Package</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your productivity with our expert virtual assistants. 
          Select the package that best fits your needs and start focusing on what truly matters.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative overflow-hidden transition-all duration-300 ${
              selectedPlan === plan.name ? 'border-blue-500 shadow-lg scale-105' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">{plan.name}</span>
                <Clock className="w-6 h-6 text-blue-500" />
              </CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.pricePerHour}</span>
                <span className="text-gray-500">/hour</span>
              </div>
              <div className="text-lg text-gray-600 mt-2">
                {plan.hours} hours/month
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => handleGetStarted(plan.name)}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 mb-4">
          Not sure which package is right for you?
        </p>
        <Link href="/consultation">
          <Button variant="outline" className="inline-flex items-center">
            Book a Discovery Call
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VaHoursSeller;