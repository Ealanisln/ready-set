// src/components/payment/PaymentCanceled.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RefreshCcw } from "lucide-react";

export const PaymentCanceled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Your payment was canceled and no charges were made.</p>
          <p className="mt-2">If you have any questions or concerns, please don&apos;t hesitate to contact our support team.</p>
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
            onClick={() => window.location.href = '/pricing'}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
