// src/components/Resources/EmailTesting.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from "../../VirtualAssistant/Appointment";
import { DownloadPopup } from "../ui/DownloadPopup";

const EmailTesting = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  const guideTitle = "Email A/B Testing Made Simple";

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                {guideTitle}:
              </h2>
              <h3 className="text-xl text-gray-600">
                A Guide for Business Owners
              </h3>

              <p className="text-gray-600">
                If you are a business owner, small business owner, or
                solopreneur looking to improve your email campaigns but are not
                sure where to start, A/B testing is your new best friend. It is
                not as complicated as it sounds, and the insights it provides
                can help you make informed decisions about what works - and what
                doesn't.
              </p>

              <h2 className="text-xl font-semibold text-gray-800">
                How This Guide Helps You
              </h2>
              <p className="text-gray-600">
                Inside this guide, you will learn what A/B testing is and how it
                works - explained simply, without the jargon. You'll discover
                key areas to test, like subject lines, CTAs, visuals, and
                timing, along with practical tips to run tests that lead to
                better open rates, clicks and conversions.
              </p>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  What You Will Get
                </h4>
                <ul className="space-y-4 text-gray-600">
                  <li>• What Email A/B Testing is</li>
                  <li>• Why A/B Testing Matters</li>
                  <li>• How to Get Started</li>
                  <li>• Key Email Elements to Test</li>
                  <li>• When to A/B Test</li>
                  <li>• Biggest A/B Testing Challenges</li>
                  <li>• A/B Testing Checklist</li>
                  <li>• 7 High-Performing Subject Line Strategies</li>
                </ul>
              </div>

              <p className="text-gray-600">
                This free guide is your roadmap for crafting a winning email
                strategy-but for monitoring, forecasting and other menial tasks,
                delegate it to us!
              </p>

              <p className="text-gray-600">
                <strong>
                  Download your free Email Metrics Template report now to get
                  started.
                </strong>
              </p>

              <p className="text-gray-600">
                Ready for more hands-on support?{" "}
                <span className="text-black-500 font-bold">
                  Book a Consultation
                </span>{" "}
                Today and let our experts handle the heavy lifting so you can
                focus on what you do best.
              </p>
            </div>

             <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
              <img
              src="/images/resources/6.webp"
              onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.onerror = null; // Prevent infinite loop
              img.src = "/images/resources/6.png"; // Fallback PNG
              }}
              alt="Business woman sitting and smiling"
              className="mb-4 w-full rounded-lg"
              />
              <h2 className="mb-2 text-center text-2xl font-bold">
              Email A/B Testing 
              <div className="mt-1">Made Simple</div>
              </h2>
              <div className="mx-auto my-4 h-px w-32 bg-black"></div>
              <p className="text-center text-sm">A Guide for Business Owners</p>
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
  downloadUrl="/path/to/your/guide.pdf" // Add this line with the actual path to your download
/>

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

export default EmailTesting;