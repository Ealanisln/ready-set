"use client";

import React from "react";
import AppointmentDialog from "../VirtualAssistant/Appointment";




const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Tell Us What You Need",
      description:
        "Fill out our online form or give us a call. Share your specific requirements—whether it's catering delivery, flower transportation, or virtual assistant services like social media management or email marketing.",
    },
    {
      number: "02",
      title: "Get a Customized Plan",
      description:
        "We'll review your needs and craft a tailored solution just for you. You'll receive a transparent proposal outlining the services, timelines, and pricing.",
    },
    {
      number: "03",
      title: "Leave the Execution to Us",
      description:
        "Our team gets to work! From timely deliveries to efficient administrative tasks, we handle everything with precision, professionalism, and care.",
    },
    {
      number: "04",
      title: "Track and Stay Updated",
      description:
        "Stay informed every step of the way. Use our tracking tools for logistics or receive regular updates on virtual assistant tasks. We prioritize clear and consistent communication to keep you in the loop.",
    },
    {
      number: "05",
      title: "Evaluate and Improve",
      description:
        "We're committed to continuous improvement. After each project or delivery, we'll check in for your feedback to ensure we're exceeding your expectations.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <p className="mx-auto mb-16 max-w-3xl text-center text-gray-700 italic">
          At Ready Set, we make logistics and virtual assistance simple and
          hassle-free. Whether you need seamless delivery services or
          professional virtual support, our process is designed to ensure a
          smooth experience every step of the way.
        </p>

        {/* Steps */}
        <div className="mx-auto max-w-3xl space-y-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-8 border-b pb-8"
            >
              <div className="flex-shrink-0 text-6xl font-bold text-yellow-400">
                {step.number}
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 space-y-4 text-center">
          <h2 className="text-2xl font-bold">Get Started Today!</h2>
          <p className="text-gray-600">
            Click below to book a consultation or request a quote.
          </p>
          <p className="text-gray-600">
            Let us handle the details so you can focus on growing your business.
          </p>
        </div>
        <div className="mt-8 flex justify-center items-center md:mt-12 lg:mt-16 xl:mt-20">
          <AppointmentDialog
            buttonVariant="amber"
            calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
          />
        </div>
        </div>
      </div>
  );
};

export default HowItWorks;
