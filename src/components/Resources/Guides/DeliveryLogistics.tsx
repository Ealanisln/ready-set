// src/components/Resources/Guides/DeliveryLogistics.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from "../../VirtualAssistant/Appointment";
import { DownloadPopup } from "../ui/DownloadPopup";

const DeliveryLogistics = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  const guideTitle = "Addressing Key Issues in Delivery Logistics";
    
  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                {guideTitle}
              </h2>
              <h3 className="text-xl text-gray-600">A Practical Guide</h3>

              <p className="text-gray-600">
                Are you navigating the complex world of delivery logistics? This
                guide equips business owners with practical solutions to the
                most pressing challenges in the delivery market, from optimizing
                operations to managing costs and ensuring customer satisfaction.
              </p>

              <p className="text-gray-600">
                Whether you're launching a new delivery service or scaling your
                operations, this guide provides actionable insights to help you
                stay competitive in an ever-evolving industry.
              </p>

              <h2 className="text-xl font-semibold text-gray-800">
                Why this guide is essential:
              </h2>
              <div className="space-y-4">
                <ul className="space-y-4 text-gray-600">
                  <li>
                    •{" "}
                    <span className="font-bold">
                      Understand Key Challenges:
                    </span>{" "}
                    Gain insight into the most common issues faced in delivery
                    logistics, such as last-mile delivery, cost management, and
                    route optimization.
                  </li>
                  <li>
                    •{" "}
                    <span className="font-bold">
                      Actionable Solutions:
                    </span>{" "}
                    Learn practical strategies to overcome logistical hurdles
                    and enhance operational efficiency.
                  </li>
                  <li>
                    •{" "}
                    <span className="font-bold">
                      Improve Customer Satisfaction:
                    </span>{" "}
                    Implement tips to enhance delivery speed, accuracy, and
                    overall customer experience.
                  </li>
                  <li>
                    •{" "}
                    <span className="font-bold">
                      Save Time and Money:
                    </span>{" "}
                    Identify cost-effective methods to streamline your logistics
                    processes and boost profitability.
                  </li>
                </ul>
              </div>

              <p className="text-gray-600">
                <strong>Download this must-read resource</strong> to take a step
                forward in mastering delivery logistics.
              </p>

              <p className="text-gray-600">
                If you found this guide helpful, share it with your network or
                schedule a consultation call with us. Ready to take the next
                step in optimizing your delivery operations? Contact{" "}
                <span className="font-bold text-blue-500 underline">
                  Ready Set Group
                </span>{" "}
                now!
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/5.png"
                  alt="Delivery person with package"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  Addressing Key Issues
                  <div className="mt-1">in Delivery Logistics</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">A Practical Guide</p>
              </Card>

              <div className="mt-4 flex flex-col items-center">
                <img
                  src="/images/logo/new-logo-ready-set.png"
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

export default DeliveryLogistics;