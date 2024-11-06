'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Zap, Check, ArrowRight } from 'lucide-react';

interface Plan {
  icon: React.ElementType;
  name: string;
  description: string;
  hours: number;
  pricePerHour: number;
  features: string[];
  popular?: boolean;
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
      icon: Clock,
      name: "Starter",
      description: "Perfect for small businesses and entrepreneurs",
      hours: 20,
      pricePerHour: 35,
      features: [
        "General Admin Support",
        "Email Management",
        "Calendar Management",
        "Basic Data Entry",
        "Monday-Friday support"
      ]
    },
    {
      icon: Users,
      name: "Professional",
      description: "Ideal for growing businesses and teams",
      hours: 40,
      pricePerHour: 32,
      popular: true,
      features: [
        "All Starter features",
        "Project Management",
        "Social Media Management",
        "Customer Support",
        "Priority Response Time"
      ]
    },
    {
      icon: Zap,
      name: "Enterprise",
      description: "Comprehensive support for large organizations",
      hours: 80,
      pricePerHour: 29,
      features: [
        "All Professional features",
        "Dedicated Team of Assistants",
        "Strategic Planning Support",
        "Custom Workflow Integration",
        "24/7 Priority Support"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pt-16">
      <h1 className="text-4xl font-bold text-center mb-2">Virtual Assistant Packages</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Transform your productivity with our expert virtual assistants
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative transition-transform duration-200 hover:scale-105 ${
              plan.popular ? 'border-primary shadow-lg' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <plan.icon className="h-5 w-5" />
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="font-bold text-2xl">${plan.pricePerHour}/hour</div>
                <div className="text-muted-foreground">{plan.hours} hours/month</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full group"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleGetStarted(plan.name)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
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