"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AppointmentDialog from '@/components/VirtualAssistant/Appointment';
import { DownloadPopup } from '../ui/DownloadPopup';

const StartSocialMedia = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl = 
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  
  const guideTitle = "How to Start Social Media Marketing Made Simple";

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
              If you're a business owner, small business operator, or solopreneur struggling to maintain a consistent social media presence, 
              this social media marketing guide is for you. You might feel overwhelmed by content creation, unsure of which platforms to focus on, or frustrated by low engagement. 
              Social media doesn't have to be complicated—with the right approach, you can turn followers into loyal customers.
              Inside this guide, you'll learn how to build a results-driven social media strategy. 
              You'll discover how to identify the best platforms for your business, create content that engages and converts, and use social media marketing metrics to refine your approach. 
              Additionally, you'll learn how to leverage Virtual Assistants to stay consistent without the stress.

              </p>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  What You Will Get
                </h3>
                <ul className="space-y-4 text-gray-600">
                  <li>• What Social Media Marketing Is </li>
                  <li>• Why Social Media Matters </li>
                  <li>• How to Get Started </li>
                  <li>• Key Elements of a Social Media Strategy</li>
                  <li>• Common Mistakes to Avoid </li>
                  <li>• Social Media Metrics to Track </li>
                  <li>• How Virtual Assistants Can Help </li>
                </ul>
              </div>

              <p className="text-gray-600">
              This free guide provides a step-by-step roadmap to streamline your social media efforts, 
              so you can focus on growing your business.
              </p>

              <div className="space-y-4">
                <p className="font-bold">
                Download your free Social Media Strategy Checklist now to get started.
                </p>
                <p className="text-gray-600">
                Ready for more support? {" "}
                <span className="font-bold"> Book a Consultation </span>{" "} with Ready Set Group LLC today to see how our Virtual Assistant 
                services can simplify your social media management, giving you more time to focus on what you do best.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/8.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null; // Prevent infinite loop
                    img.src = "/images/resources/8.png"; // Fallback PNG
                    }}
                  alt="A woman sitting and just about to start a speech"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  How To Start Social
                  <div className="mt-1">Media Marketing</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">A Business Owner's Guide</p>
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
                                  downloadUrl={`/downloads/how-to-hire-the-right-virtual-assistant.pdf`} // Adjust this path to where your PDF is actually stored
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

export default StartSocialMedia;