"use client"

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from '../VirtualAssistant/Appointment';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadCaptureForm } from "./DownloadPopup";

{/* Third Section */}
const GuideChoosePartner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  const handleDownloadSuccess = async () => {
    // Close the dialog
    setIsDialogOpen(false);
    
    try {
      // Trigger the file download
      const response = await fetch('https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLBKaCt1vzmKWLEJjpXc9POd8SYbl7otG5ACZQ');
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-metrics-guide.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  return (
    <div className="pt-32 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-800">The Complete Guide to Choosing the Right Delivery Partner</h2>
                  <h3 className="text-xl text-gray-600">A Strategic Approach</h3>
        
                  <p className="text-gray-600">
                    Whether you're running a small business or managing a larger operation, this guide provides a structured approach to making an informed decision that will support your business growth and customer satisfaction goals.
                  </p>
        
                  <p className="text-gray-600">
                    This comprehensive resource helps businesses navigate the critical process of selecting the right delivery partner in today's evolving e-commerce landscape. The guide is particularly valuable because:
                  </p>
        
                  <p className="text-gray-600">1. The guide provides detailed frameworks for evaluating potential partners across four key areas:</p>
                  <ul className="space-y-4 text-gray-600">
                    <li>• Cost structure analysis (both direct and indirect costs)</li>
                    <li>• Customer experience optimization</li>
                    <li>• Technology integration capabilities</li>
                    <li>• Support system evaluation</li>
                  </ul>
        
                  <div className="space-y-4">
                    <p className="text-gray-600">2. It includes practical implementation tools such as:</p>
                    <ul className="space-y-4 text-gray-600">
                      <li>• Step-by-step checklists</li>
                      <li>• Industry-specific considerations for specialized deliveries</li>
                      <li>• Risk management strategies</li>
                      <li>• Performance measurement metrics</li>
                    </ul>
                  </div>
        
                  <div className="space-y-4">
                    <p className="font-bold text-gray-600">This resource will help your business succeed by:</p>
                    <ul className="space-y-4 text-gray-600">
                      <li>• Avoiding common pitfalls in delivery partner selection</li>
                      <li>• Ensuring comprehensive evaluation of potential partners</li>
                      <li>• Establishing clear metrics for success</li>
                      <li>• Maintaining quality control throughout the partnership</li>
                      <li>• Creating contingency plans for potential disruptions</li>
                    </ul>
                  </div>
        
                  <div className="space-y-4">
                  <p className="font-bold">
                   Download your Free Delivery Partner Selection Guide{" "}
              <span className="text-gray-600 font-normal">to get more insights!</span>
                </p>
                 </div>  
        
                  <p className="text-gray-600">
                    If you found this guide helpful, share it with your network or schedule a consultation call with us. Ready to take the next step in optimizing your delivery operations? Contact <span className="text-blue-500 font-bold underline">Ready Set Group</span> now!
                  </p>
                </div>
        
                <div className="space-y-6">
                  <Card className="bg-yellow-400 p-6 rounded-lg">
                    <img src="/images/resources/3.png" alt="Business woman thinking"
                      className="w-full rounded-lg mb-4"/>
                    <h2 className="text-2xl font-bold text-center mb-2">
                      The Complete Guide to
                      <div className="mt-1">Choosing the Right</div>
                      <div className="mt-1">Delivery Partner</div>
                    </h2>
                    <div className="w-32 h-px bg-black mx-auto my-4"></div>
                    <p className="text-center text-sm">A Strategic Approach</p>
                  </Card>
        
                  <div className="flex flex-col items-center mt-4">
                    <img src="/images/logo/new-logo-ready-set.png" alt="Company logo" className="w-24 h-auto mb-2" />
                    <div className="bg-black text-white px-4 py-0 rounded-lg">
                      <p className="text-sm tracking-wider">READYSETLLC.COM</p>
                    </div>
                  </div>
        
                  <div className="space-y-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500">
                      Download Now
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <LeadCaptureForm onSuccess={handleDownloadSuccess} />
                  </DialogContent>
                </Dialog>
                 {/* AppointmentDialog */}
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