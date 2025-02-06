// src/components/Resources/EmailMarketing.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentDialog from "../../VirtualAssistant/Appointment";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadCaptureForm } from "../ui/DownloadPopup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const EmailMarketingGuide = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  const handleDownloadSuccess = async () => {
    // Close the dialog
    setIsDialogOpen(false);

    try {
      // Trigger the file download
      const response = await fetch(
        "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLqQpOUEDnRDmNThVvWg8M1eG9sx2Iaju357C4",
      );
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "email-metrics-guide.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Second Section */}
        <section className="rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                What Is Email Marketing
              </h2>
              <h3 className="text-xl text-gray-600">
                A Business Owner's Guide to Getting Started
              </h3>

              <p className="text-gray-600">
                Does the idea of email marketing feel overwhelming or outdated?
                Many business owners mistakenly think email marketing is
                reserved for large corporations or struggle with ineffective
                campaigns. In reality, email marketing is a powerful tool to
                build meaningful customer relationships and drive sales—no
                matter your business size.
              </p>

              <h2 className="text-xl font-semibold text-gray-800">
                How This Guide Helps You
              </h2>
              <p className="text-gray-600">
                This guide breaks down email marketing essentials, from its
                benefits and types of campaigns to the key steps for launching a
                successful strategy. Whether you're new to email marketing or
                looking to optimize your approach, this guide is your starting
                point.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  What You Will Learn
                </h3>
                <ul className="space-y-4 text-gray-600">
                  <li>• What Is Email Marketing?</li>
                  <li>• The Pros and Cons of Email Marketing</li>
                  <li>• Types of Email Marketing Campaigns</li>
                  <li>• How to Build an Email List</li>
                  <li>• Getting Customer Consent</li>
                  <li>
                    • Lead Magnets That Work: Discover how to use free resources
                    to attract and retain subscribers.
                  </li>
                  <li>• Email Authentication Essentials</li>
                </ul>
              </div>

              <p className="text-gray-600">
                This guide offers clear steps to understand email marketing,
                grow your audience, and build meaningful connections with your
                customers. Use it to get started today.
              </p>

              <p className="text-gray-600">
                Ready for more hands-on support?{" "}
                <span className="font-bold">Book a Consultation</span> Today and
                let our experts handle the heavy lifting so you can focus on
                what you do best.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/2.png"
                  alt="Business woman thinking"
                  className="mb-4 w-full rounded-lg"
                />
                <h2 className="mb-2 text-center text-2xl font-bold">
                  What Is Email
                  <div className="mt-1">Marketing</div>
                </h2>
                <div className="mx-auto my-4 h-px w-32 bg-black"></div>
                <p className="text-center text-sm">
                  The Business Owner's Guide to
                </p>
                <div className="text-center text-sm">Getting Started</div>
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-yellow-500">
                      Download Now
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <VisuallyHidden>
                      <DialogPrimitive.Title>
                        Download Guide Form
                      </DialogPrimitive.Title>
                    </VisuallyHidden>
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

export default EmailMarketingGuide;
