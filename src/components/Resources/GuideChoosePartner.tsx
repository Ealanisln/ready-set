"use client"

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from '../VirtualAssistant/Appointment';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadCaptureForm } from "./DownloadPopup";

const GuideFeatureList = ({ items }) => (
  <ul className="space-y-4 text-gray-600">
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        <span className="mr-2">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const GuideChoosePartner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  const handleDownloadSuccess = async () => {
    setIsDialogOpen(false);
    
    try {
      const response = await fetch('https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLBKaCt1vzmKWLEJjpXc9POd8SYbl7otG5ACZQ');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-metrics-guide.pdf';
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Content arrays...
  const frameworkFeatures = [
    'Cost structure analysis (both direct and indirect costs)',
    'Customer experience optimization',
    'Technology integration capabilities',
    'Support system evaluation'
  ];

  const implementationTools = [
    'Step-by-step checklists',
    'Industry-specific considerations for specialized deliveries',
    'Risk management strategies',
    'Performance measurement metrics'
  ];

  const businessBenefits = [
    'Avoiding common pitfalls in delivery partner selection',
    'Ensuring comprehensive evaluation of potential partners',
    'Establishing clear metrics for success',
    'Maintaining quality control throughout the partnership',
    'Creating contingency plans for potential disruptions'
  ];
  
  return (
    <div className="pt-32 min-h-screen p-6">
      {/* Rest of the component structure... */}
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column content... */}
            <div className="space-y-6">
              {/* Existing content... */}
            </div>
    
            {/* Right column with the card and dialogs */}
            <div className="space-y-6">
              <Card className="bg-yellow-400 p-6 rounded-lg">
                {/* Existing card content... */}
              </Card>
    
              <div className="flex flex-col items-center mt-4">
                {/* Logo and company name... */}
              </div>
    
              <div className="space-y-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button 
                      className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500"
                      aria-label="Download guide"
                    >
                      Download Now
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogTitle>
                      Download Delivery Partner Selection Guide
                    </DialogTitle>
                    <LeadCaptureForm onSuccess={handleDownloadSuccess} />
                  </DialogContent>
                </Dialog>
                
                <div className="flex justify-center">
                  <AppointmentDialog
                    buttonText="Book A Consultation Today"
                    buttonVariant="amber"
                    buttonClassName="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500 flex justify-center items-center"
                    dialogTitle="Schedule Your Free Consultation"
                    dialogDescription="Choose a time that works best for you to discuss how we can help you save on hiring costs."
                    calendarUrl={calendarUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GuideChoosePartner;
