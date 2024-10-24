import React from "react";
import Image from "next/image";
import Navbar from "@/components/Header";

const HeroHeader = () => {
  const benefits = [
    {
      text: "Business on autopilot",
      iconPath: "/images/virtual/drive.svg",
      description: "Automated systems",
      alt: "Automation icon",
    },
    {
      text: "Reclaim your time",
      iconPath: "/images/virtual/time.svg",
      description: "Time management",
      alt: "Clock icon",
    },
    {
      text: "Earn more without worry",
      iconPath: "/images/virtual/dollar.svg",
      description: "Increased earnings",
      alt: "Dollar icon",
    },
  ];

  return (
    <div className="bg-black">
      <nav className="relative z-50">
        <Navbar />
      </nav>

      <section className="relative isolate">
        <div className="relative min-h-screen">
          <div className="absolute inset-0">
            <Image
              src="/images/virtual/header-bg.jpg"
              alt="Background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-40">
            <div className="text-center">
              <h1 className="mb-6 text-white" style={{ fontFamily: "Kabel" }}>
                <div className="mt-2">
                  <span className="text-6xl font-bold leading-tight">
                    Ready, Set, Delegate!
                  </span>
                </div>
                <div className="mt-6">
                  <span className="text-2xl font-normal leading-relaxed md:text-4xl">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </div>
              </h1>

              <div className="mt-12">
                <button className="rounded-full bg-amber-400 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-500">
                  BOOK A DISCOVERY CALL
                </button>
              </div>

              <div className="mt-32 flex flex-wrap justify-center gap-8 pb-20 md:gap-12 lg:flex-nowrap lg:gap-24">
                {benefits.map(({ text, iconPath, description, alt }) => (
                  <div
                    key={text}
                    className="group flex items-center gap-4 transition-all duration-300 hover:scale-105"
                  >
                    <div className="">
                      <Image
                        src={iconPath}
                        alt={alt}
                        width={48}
                        height={48}
                        className="h-8 w-8" // Increased from w-8 h-8
                      />
                    </div>
                    <span className="text-lg font-bold text-white">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 320"
              className="fill-white"
              preserveAspectRatio="none"
            >
              <path d="M0,160 C360,240 720,80 1080,160 C1260,200 1440,160 1440,160 L1440,320 L0,320 Z" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;
