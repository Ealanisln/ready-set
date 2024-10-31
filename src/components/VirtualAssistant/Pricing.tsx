"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Users, Zap, Check, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  name: string;
  email: string;
  company: string;
  requirements: string;
}

interface Plan {
  icon: React.ElementType;
  title: string;
  description: string;
  price: string;
  popular?: boolean;
  features: string[];
}

export default function Component() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    requirements: ''
  });

  const plans: Plan[] = [
    {
      icon: Clock,
      title: "Basic Bundle",
      description: "Perfect for small businesses and entrepreneurs",
      price: "$499/month",
      features: [
        "20 hours of virtual assistance per month",
        "Email and calendar management",
        "Basic data entry and research",
        "Monday-Friday support"
      ]
    },
    {
      icon: Users,
      title: "Professional Bundle",
      description: "Ideal for growing businesses and teams",
      price: "$899/month",
      popular: true,
      features: [
        "40 hours of virtual assistance per month",
        "Project management and task coordination",
        "Social media management",
        "Customer service support",
        "Priority support response"
      ]
    },
    {
      icon: Zap,
      title: "Enterprise Bundle",
      description: "Comprehensive support for large organizations",
      price: "Custom pricing",
      features: [
        "80+ hours of virtual assistance per month",
        "Dedicated team of assistants",
        "Advanced reporting and analytics",
        "Custom workflow integrations",
        "24/7 priority support"
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Here you would typically handle the form submission
    setTimeout(() => setFormSubmitted(false), 3000);
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pt-16">
      <h1 className="text-4xl font-bold text-center mb-2">Custom Quotes and Bundles</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Tailored virtual assistant services to meet your unique needs
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {plans.map((plan) => (
          <Card 
            key={plan.title}
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
                {plan.title}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 font-bold text-2xl">{plan.price}</div>
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
                onClick={() => setSelectedPlan(plan.title)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

     
    </div>
  );
}