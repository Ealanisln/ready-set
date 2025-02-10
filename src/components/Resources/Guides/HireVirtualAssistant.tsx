"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AppointmentDialog from '@/components/VirtualAssistant/Appointment';
import DownloadPopup from '../ui/DownloadPopup';

const GuideVirtualAssistant = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";
  
  const guideTitle = "How to Hire the Right Virtual Assistant";

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
                Whether you're a busy entrepreneur or managing a growing business, 
                this guide provides a structured approach to making an informed decision 
                that will enhance your productivity and support your business growth objectives.
              </p>

              <p className="text-gray-600">
                This comprehensive resource helps businesses navigate the critical process 
                of selecting the right virtual assistant in today's dynamic work environment. 
                The guide provides detailed frameworks for evaluation across key areas:
              </p>

              <div className="space-y-4">
                <p className="text-gray-600">
                  1. Skills and Competency Assessment:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li>• Technical proficiency evaluation</li>
                  <li>• Communication skills assessment</li>
                  <li>• Problem-solving capabilities</li>
                  <li>• Adaptability and learning ability</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  2. Practical Implementation Tools:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li>• Comprehensive interview questionnaires</li>
                  <li>• Skills assessment templates</li>
                  <li>• Trial period evaluation metrics</li>
                  <li>• Performance monitoring frameworks</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-gray-600">
                  This resource will help your business succeed by:
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li>• Defining clear roles and responsibilities</li>
                  <li>• Establishing effective communication channels</li>
                  <li>• Creating structured onboarding processes</li>
                  <li>• Setting measurable performance indicators</li>
                  <li>• Developing long-term growth opportunities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold">
                  Download your Free Virtual Assistant Selection Guide{" "}
                  <span className="font-normal text-gray-600">
                    to get more insights!
                  </span>
                </p>
              </div>

              <p className="text-gray-600">
                Ready to optimize your business operations with a virtual assistant? Contact{" "}
                <span className="font-bold text-blue-500 underline">
                  Ready Set Group
                </span>{" "}
                now!
              </p>
            </div>

            <div className="space-y-6">
              <Card className="rounded-lg bg-yellow-400 p-6">
                <img
                  src="/images/resources/7.png"
                  alt="Business woman thinking"
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

export default GuideVirtualAssistant;