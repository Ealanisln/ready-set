"use client";

import React from "react";
import AppointmentDialog from "./Appointment";

interface CTAProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  logoSrc?: string;
  logoAlt?: string;
  onButtonClick?: () => void;
}

const DiscoveryBanner: React.FC<CTAProps> = ({
  heading = "Your business could be rapidly approaching its ceiling.",
  subheading = "Why limit yourself with how your business works today? Book a Discovery Call now to smash through your business ceiling and scale up the right way—before clients start walking out on you.",
  buttonText = "BOOK A DISCOVERY CALL",
  logoSrc = "/images/logo/new-logo-ready-set.png",
  logoAlt = "Ready Set logo",
  onButtonClick = () => {},
}) => {
  return (
    <div className="relative w-full">
      <div className="relative w-full bg-[#ffd766] pt-10">
        {/* Top curve */}
        <div className="absolute inset-x-0 top-0">
          <svg
            className="h-16 w-full"
            viewBox="0 0 1440 50"
            preserveAspectRatio="none"
          >
            <path
              fill="white"
              d="M0,50 C360,20 720,20 1440,50 L1440,0 L0,0 Z"
            />
          </svg>
        </div>

        {/* Content container */}
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <h2 className="mx-auto max-w-3xl text-4xl font-bold text-[#1a1a1a] md:text-5xl">
              Your business could be{" "}
              <span className="font-extrabold">
                rapidly approaching its ceiling.
              </span>
            </h2>

            <p className="mx-auto max-w-3xl text-lg text-gray-800">
              {subheading}
            </p>

            <div className="flex justify-center pt-4">
              <AppointmentDialog
                buttonVariant="black"
                calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
              />
            </div>
          </div>
        </div>

        {/* Logo section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="flex items-center justify-center">
            <picture>
              <source
                srcSet="/images/virtual/logo-headset.webp"
                type="image/webp"
              />
              <img
                src="/images/virtual/logo-headset.png"
                alt="Virtual Headset Logo"
                className="h-40 w-auto object-contain md:h-40"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryBanner;
