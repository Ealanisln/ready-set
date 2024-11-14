"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Zap, Check, ArrowRight, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Plan {
  icon: React.ElementType;
  title: string;
  description: string;
  pricePerHour: number;
  hours: number;
  totalPrice: number;
  popular?: boolean;
  features: string[];
}

export default function PricingComponent() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans: Plan[] = [
    {
      icon: Clock,
      title: "Starter Package",
      description: "Perfect for small tasks and projects",
      pricePerHour: 25,
      hours: 20,
      totalPrice: 500, // 20 hours × $25
      features: [
        "20 hours of virtual assistance",
        "Valid for 3 months",
        "Email and calendar management",
        "Basic data entry and research",
        "Unused hours roll over"
      ]
    },
    {
      icon: Users,
      title: "Professional Package",
      description: "Ideal for growing businesses",
      pricePerHour: 22,
      hours: 50,
      totalPrice: 1100, // 50 hours × $22
      popular: true,
      features: [
        "50 hours of virtual assistance",
        "Valid for 6 months",
        "Project management",
        "Social media management",
        "Priority support",
        "Unused hours roll over"
      ]
    },
    {
      icon: Zap,
      title: "Enterprise Package",
      description: "For businesses needing extensive support",
      pricePerHour: 20,
      hours: 100,
      totalPrice: 2000, // 100 hours × $20
      features: [
        "100 hours of virtual assistance",
        "Valid for 12 months",
        "Dedicated team of assistants",
        "Custom workflow integrations",
        "24/7 priority support",
        "Unused hours roll over"
      ]
    }
  ];

  const handlePurchase = async (plan: Plan) => {
    try {
      setLoading(plan.title);
      
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planTitle: plan.title,
          hours: plan.hours,
          totalPrice: plan.totalPrice,
          pricePerHour: plan.pricePerHour
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pt-16">
      <h1 className="text-4xl font-bold text-center mb-2">Virtual Assistant Hour Packages</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Purchase blocks of hours to use whenever you need assistance
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
              <div className="mt-4">
                <div className="font-bold text-2xl">${plan.totalPrice}</div>
                <div className="text-sm text-muted-foreground">
                  ${plan.pricePerHour}/hour • {plan.hours} hours
                </div>
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
                onClick={() => handlePurchase(plan)}
                disabled={loading === plan.title}
              >
                {loading === plan.title ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Purchase Hours
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}