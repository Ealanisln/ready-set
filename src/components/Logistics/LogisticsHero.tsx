// src/components/Logistics/LogisticsHero.tsx
import { Clock, Truck, Shield } from "lucide-react";
import Link from "next/link";
import AppointmentDialog from "../VirtualAssistant/Appointment";
import ScheduleDialog from "./Schedule";
import GetQuoteButton from "./GetQuoteButton";

const LogisticsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/logistics/bg-hero.jpg')",
              backgroundSize: "cover",
              height: "100vh",
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-grow items-center justify-center px-4 pt-20">
            <div className="max-w-2xl rounded-2xl bg-white/95 p-10 text-center shadow-lg backdrop-blur-sm">
              <h1 className="mb-3 text-4xl font-bold text-gray-900">
                Premium Logistics Services
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Bay Area's Most Trusted Delivery Partner Since 2019
              </p>
              <div className="flex justify-center gap-4">
                <GetQuoteButton />
                {/* <Link
                  href="/schedule"
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Schedule a Call
                </Link> */}

                <ScheduleDialog
                  calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
                  buttonText="Schedule a Call"
                />
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="px-4 pb-16">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Specialized Delivery Card */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-4">
                    <Truck className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Specialized Delivery
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Expert handling of your needs with temperature-controlled
                    vehicles and trained professionals.
                  </p>
                  {/* <Link 
                    href="/learn-more"
                    className="inline-flex items-center text-yellow-500 font-medium hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link> */}
                </div>

                {/* Time-Critical Delivery Card */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-4">
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Time-Critical Delivery
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Guaranteed on-time delivery for your events with real-time
                    tracking and dedicated route optimization.
                  </p>
                  <Link
                    href="/learn-more"
                    className="inline-flex items-center font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link>
                </div>

                {/* Quality Guaranteed Card */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-4">
                    <Shield className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Quality Guaranteed
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Trusted by leading tech companies including Apple, Google,
                    Facebook, and Netflix for reliable service.
                  </p>
                  <Link
                    href="/learn-more"
                    className="inline-flex items-center font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Learn More
                    <span className="ml-2">→</span>
                  </Link>
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
