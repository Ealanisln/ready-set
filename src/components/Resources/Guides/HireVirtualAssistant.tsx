"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AppointmentDialog from '@/components/VirtualAssistant/Appointment';
import DownloadPopup from '../ui/DownloadPopup';

const GuideVirtualAssistant = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl = 
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  
  const guideTitle = "How to Hire the Right Virtual Assistant";

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                {guideTitle} - Your Step-by-Step Guide
              </h2>
              
              <p className="text-gray-600">
                Hiring a Virtual Assistant (VA) isn't just about ticking tasks off your list—it's 
                about finding someone who fits your business and work style. Before you start, 
                ask yourself: What tasks do I need help with? What skills should my VA have? 
                This guide walks you through the process of finding the right VA who can help 
                you work smarter and free up your time.
              </p>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  How This Guide Helps You
                </h3>
                <p className="text-gray-600">
                  Learn how to hire the right Virtual Assistant for your business. This guide 
                  covers how to identify tasks to delegate, find qualified VAs, evaluate 
                  candidates, and onboard them into your workflow. You'll also learn how to 
                  manage and measure their performance effectively.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  What You Will Get
                </h3>
                <ul className="space-y-4 text-gray-600">
                  <li>• Hiring the Perfect Virtual Assistant for Your Business</li>
                  <li>• How to Find the Right Virtual Assistant (VA)</li>
                  <li>• Checklist: What to Look for in a VA</li>
                  <li>• Benefits of Having a Virtual Assistant for Your Business</li>
                </ul>
              </div>

              <p className="text-gray-600">
                Hiring a VA is a smart move when you're ready to focus on the bigger picture. 
                Let Ready Set Group LLC match you with professionals who fit your business needs.
              </p>

              <div className="space-y-4">
                <p className="font-bold">
                  Get your free guide and start delegating today.
                </p>
                <p className="font-bold">
                  Want personalized support? Book a Discovery Call with Ready Set Group LLC 
                  and let us help you find the right VA.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/7.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null; // Prevent infinite loop
                    img.src = "/images/resources/7.png"; // Fallback PNG
                    }}
                  alt="Business woman working on a computer"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  The Complete Guide to
                  <div className="mt-1">Choosing the Right</div>
                  <div className="mt-1">Virtual Assistant</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">A Strategic Approach</p>
              </Card>

              <div className="mt-4 flex flex-col items-center">
                  <img
                  src="/images/logo/new-logo-ready-set.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null; // Prevent infinite loop
                    img.src = "/images/logo/new-logo-ready-set.png"; // Fallback PNG
                  }}
                  alt="Company logo"
                  className="mb-2 h-auto w-24"
                />
                <div className="rounded-lg bg-black px-4 py-0 text-white">
                  <p className="text-sm tracking-wider">READY SET GROUP, LLC</p>
                </div>
                </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500"
                >
                  Download Now
                </button>

                <DownloadPopup
                  isOpen={isDownloadOpen}
                  onClose={() => setIsDownloadOpen(false)}
                  title={guideTitle}
                />

                <div className="flex justify-center">
                  <AppointmentDialog
                    buttonText="Book A Discovery Call"
                    buttonVariant="amber"
                    buttonClassName="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500 flex justify-center items-center"
                    dialogTitle="Schedule Your Free Discovery Call"
                    dialogDescription="Choose a time that works best for you to discuss how we can help you find the right Virtual Assistant."
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

export default GuideVirtualAssistant;