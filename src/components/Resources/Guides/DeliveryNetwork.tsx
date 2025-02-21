"use client";

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppointmentDialog from '@/components/VirtualAssistant/Appointment';
import DownloadPopup from '../ui/DownloadPopup';

const DeliveryNetwork = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl = 
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  
  const guideTitle = "Building a Reliable Delivery Network";

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left column content */}
            <div className="space-y-6">
              {/* ... Previous left column content remains the same ... */}
              <h2 className="text-4xl font-bold text-gray-800">
                {guideTitle} Network
              </h2>
              <h3 className="text-xl text-gray-600">
                Key Considerations for Business Owners
              </h3>
              
              <p className="text-gray-600">
                This guide breaks down the key components of a strong delivery system, helping you optimize logistics, 
                improve customer satisfaction, and cut costs without the confusion of technical jargon.
              </p>

              <p className="text-gray-600">
                You'll discover the essential strategies to build a seamless delivery process that keeps your business 
                running smoothly and customers coming back.
              </p>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                    What You Will Get
                </h3>
                <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Why a Reliable Delivery Network Matters
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Key Components of an Efficient Delivery System
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Steps to Build & Optimize Your Network
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Cost Considerations & ROI Benefits
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Common Mistakes to Avoid
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Best Practices for Long-Term Success
                    </li>
                    <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Future Trends in Delivery & Logistics
                    </li>
                </ul>
              </div>

              <p className="text-gray-600">
                This guide matters because it provides both strategic overview and tactical guidance for building 
                a delivery network that drives business growth.
              </p>

              <div className="space-y-4">
                <p className="font-bold">
                  Download your Free Building Reliable Delivery Network Guide {" "} 
                  <span className="text-gray-600 font-normal">to get more insights! </span>
                </p>
                <p className="text-gray-600">
                  If you found this guide helpful, share it with your network or
                  schedule a consultation call with us. Ready to take the next
                  step in optimizing your delivery operations? Contact{" "}
                  <a 
                    href="/logistics"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-500 underline hover:text-blue-700"
                  >
                    Ready Set Group
                  </a>{" "}
                  now!
                </p>
              </div>
            </div>

            {/* Right column with image and buttons */}
            <div className="flex flex-col items-center">
              {/* Logo at the top with more space */}
              <div className="mb-12">
                <img
                  src="/images/logo/new-logo-ready-set.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null;
                    img.src = "/images/logo/new-logo-ready-set.png";
                  }}
                  alt="Company logo"
                  className="h-auto w-32"
                />
              </div>

              {/* Container for image with white background and shadow */}
              <div className="w-full space-y-16">
                <div className="rounded-3xl bg-white p-4 shadow-xl">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src="/images/resources/9.webp"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null;
                        img.src = "/images/resources/9.png";
                      }}
                      alt="A loading machine carrying boxes"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Buttons with increased spacing */}
                <div className="flex flex-col gap-4 pt-8">
                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="w-full rounded-full bg-yellow-400 py-4 text-xl font-semibold text-gray-800 transition-colors hover:bg-yellow-500"
                  >
                    Download Now
                  </button>

                  <AppointmentDialog
                    buttonText="Schedule a Call Today"
                    buttonVariant="amber"
                    buttonClassName="w-full rounded-full bg-yellow-400 py-4 text-xl font-semibold text-gray-800 transition-colors hover:bg-yellow-500 flex justify-center items-center"
                    dialogTitle="Schedule Your Free Discovery Call"
                    dialogDescription="Choose a time that works best for you to discuss how we can help you find the right Virtual Assistant."
                    calendarUrl={calendarUrl}
                  />
                </div>

                <DownloadPopup
                  isOpen={isDownloadOpen}
                  onClose={() => setIsDownloadOpen(false)}
                  title={guideTitle}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryNetwork;