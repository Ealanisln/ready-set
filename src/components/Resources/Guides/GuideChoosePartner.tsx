// src/components/Resources/GuideChoosePartner.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from "../../VirtualAssistant/Appointment";
import { DownloadPopup } from "../ui/DownloadPopup";

const GuideChoosePartner = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true";

  const guideTitle = "The Complete Guide to Choosing the Right Delivery Partner";

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                {guideTitle}
              </h2>
              <h3 className="text-xl text-gray-600">A Strategic Approach</h3>

              <p className="text-gray-600">
                Whether you're running a small business or managing a larger
                operation, this guide provides a structured approach to making
                an informed decision that will support your business growth and
                customer satisfaction goals.
              </p>

              <p className="text-gray-600">
                This comprehensive resource helps businesses navigate the
                critical process of selecting the right delivery partner in
                today's evolving e-commerce landscape. The guide is particularly
                valuable because:
              </p>

              <p className="text-gray-600">
                1. The guide provides detailed frameworks for evaluating
                potential partners across four key areas:
              </p>

              <ul className="space-y-4 text-gray-600">
                <li>
                  • Cost structure analysis (both direct and indirect costs)
                </li>
                <li>• Customer experience optimization</li>
                <li>• Technology integration capabilities</li>
                <li>• Support system evaluation</li>
              </ul>

              <div className="space-y-4">
                <p className="text-gray-600">
                  2. It includes practical implementation tools such as:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li>• Step-by-step checklists</li>
                  <li>
                    • Industry-specific considerations for specialized
                    deliveries
                  </li>
                  <li>• Risk management strategies</li>
                  <li>• Performance measurement metrics</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-gray-600">
                  This resource will help your business succeed by:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li>
                    • Avoiding common pitfalls in delivery partner selection
                  </li>
                  <li>
                    • Ensuring comprehensive evaluation of potential partners
                  </li>
                  <li>• Establishing clear metrics for success</li>
                  <li>
                    • Maintaining quality control throughout the partnership
                  </li>
                  <li>
                    • Creating contingency plans for potential disruptions
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold">
                  Download your Free Delivery Partner Selection Guide{" "}
                  <span className="font-normal text-gray-600">
                    to get more insights!
                  </span>
                </p>
              </div>

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

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/3.webp"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null; // Prevent infinite loop
                    img.src = "/images/resources/3.png"; // Fallback PNG
                    }}
                  alt="A person handing a bag to another person"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  The Complete Guide to
                  <div className="mt-1">Choosing the Right</div>
                  <div className="mt-1">Delivery Partner</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">A Strategic Approach</p>
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

export default GuideChoosePartner;