// src/components/payment/PaymentSuccess.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Home, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentSuccessProps {
  planName: string | null;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ planName }) => {
  const { toast } = useToast();
  const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "Copied to clipboard",
      description: "Order ID has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{orderId}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyOrderId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Package</span>
              <span className="font-medium">{planName}</span>
            </div>
          </div>
          <div className="text-center text-gray-600">
            <p>You will receive a confirmation email shortly with your package details and instructions to get started.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            className="w-full sm:w-1/2"
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
          <Button 
            className="w-full sm:w-1/2"
            onClick={() => window.location.href = '/dashboard'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
