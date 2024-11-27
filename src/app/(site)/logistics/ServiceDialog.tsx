"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { ServiceName, serviceDetails } from './types';

interface ServiceDialogProps {
  service: ServiceName;
  children: React.ReactNode;
}

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
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;