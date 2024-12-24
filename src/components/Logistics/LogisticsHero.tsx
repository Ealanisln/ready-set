import React from "react";
import { Clock, Truck, Shield } from "lucide-react";
import Link from "next/link";
import GetQuoteButton from "./GetQuoteButton";
import ScheduleDialog from "./Schedule";

const LogisticsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/logistics/bg-hero.jpg')",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Centered Card */}
          <div className="flex flex-1 items-center justify-center px-4 pb-8 pt-28 md:pt-40">
            <div className="w-full max-w-2xl rounded-2xl bg-white/95 p-4 text-center shadow-lg backdrop-blur-sm md:p-10">
              <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-4xl">
                Premium Logistics Services
              </h1>
              <p className="mb-6 text-sm text-gray-600 md:mb-8 md:text-lg">
                Bay Area's Most Trusted Delivery Partner Since 2019
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4">
                <GetQuoteButton />
                <ScheduleDialog
                  calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
                  buttonText="Schedule a Call"
                />
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="px-4 pb-8 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {/* Specialized Delivery Card */}
                <div className="rounded-xl bg-white p-5 shadow-lg">
                  <div className="mb-2">
                    <Truck className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">
                    Specialized Delivery
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Expert handling of your needs with temperature-controlled
                    vehicles and trained professionals.
                  </p>
                  {/* <Link
                    href="/learn-more"
                    className="inline-flex items-center text-sm font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link> */}
                </div>

                {/* Time-Critical Delivery Card */}
                <div className="rounded-xl bg-white p-5 shadow-lg">
                  <div className="mb-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">
                    Time-Critical Delivery
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Guaranteed on-time delivery for your events with real-time
                    tracking and dedicated route optimization.
                  </p>
                  {/* <Link
                    href="/learn-more"
                    className="inline-flex items-center text-sm font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link> */}
                </div>

                {/* Quality Guaranteed Card */}
                <div className="rounded-xl bg-white p-5 shadow-lg">
                  <div className="mb-2">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">
                    Quality Guaranteed
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Trusted by leading tech companies including Apple, Google,
                    Facebook, and Netflix for reliable service.
                  </p>
                  {/* <Link
                    href="/learn-more"
                    className="inline-flex items-center text-sm font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;
