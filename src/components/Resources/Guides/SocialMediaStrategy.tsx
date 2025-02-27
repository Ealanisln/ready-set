// Old behaviour: The user can download a PDF file by clicking the "Download Now" button.

"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AppointmentDialog from '@/components/VirtualAssistant/Appointment';
import { DownloadPopup } from '../ui/DownloadPopup';

const SocialMediaStrategy = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl = 
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  
  const guideTitle = "Social Media Strategy Guide & Template";

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-wrap-balance text-4xl font-bold text-gray-800">
                {guideTitle}
              </h1>
              <h2 className="text-xl text-gray-600">
                Sample Social Media Strategy Template
              </h2>
              
              <p className="text-gray-600">
              Managing social media can feel challenging. Many business owners struggle with creating a clear, 
              focused strategy that drives engagement and results. This {" "} <span className="font-bold"> social media strategy 
              guide </span> {" "} provides a step-by-step approach to help you define your goals, identify your audience, select the best platforms, 
              and create a content plan that works for your business.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  How This Guide Helps You
                </h3>
                <p className="text-gray-600">
                This guide takes the guesswork out of social media management, covering everything from goal setting to audience 
                identification, platform selection, and content creation. By following the steps in this guide, you’ll learn how to 
                create your own {" "} <span className="font-semibold">social media strategy template </span> that is tailored to your 
                business goals and needs.
                </p>
              </div>
            <h3 className="text-2xl font-bold text-gray-800">
             What You Will Learn
            </h3>
                <div className="space-y-4">
                <ul className="space-y-4 text-gray-600">
                  <li>
                    •{" "}
                    <span className="font-bold">
                     Defining Your Social Media Purpose:
                    </span>{" "}
                    Understand why you're on social media—whether it's to build brand awareness, drive traffic, 
                    or generate leads.
                  </li>
                  <li>
                    • <span className="font-bold">Identifying Your Target Audience:</span>{" "}
                    Learn how to define and connect with your ideal customers.
                  </li>
                  <li>
                    •{" "}
                    <span className="font-bold">
                      Choosing the Right Platforms:
                    </span>{" "}
                    Focus your efforts on platforms that align with where your audience spends their time.
                  </li>
                  <li>
                    • <span className="font-bold">Content Planning & Creation:</span>{" "}
                    Develop a content calendar that includes the right mix of content types and formats.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold">
                Download this free guide to create your social media strategy template and level up 
                your online presence for better results.
                </p>
                <p className="text-gray-600">
                By following this guide, you'll be able to optimize your social media efforts, track your progress with KPIs, 
                and create a  {" "} <span className="font-bold"> social media strategy template </span>{" "} that supports
                your business goals.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/10.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null; // Prevent infinite loop
                    img.src = "/images/resources/10.png"; // Fallback PNG
                    }}
                  alt="A woman sitting and just about to start a speech"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                Social Media
                  <div className="mt-1">Strategy Guide & Template</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">Sample Social Media Strategy Template</p>
              </Card>

              <div className="mt-4 flex flex-col items-center">
                <img
                  src="/images/logo/new-logo-ready-set.png"
                  alt="Company logo"
                  className="mb-2 h-auto w-24"
                />
                <div className="rounded-lg bg-black px-4 py-0 text-white">
                  <p className="text-sm tracking-wider">READYSETLLC.COM</p>
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

export default SocialMediaStrategy;