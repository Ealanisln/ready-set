"use client"

"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GraduationCap, MousePointerClick, UserCog } from "lucide-react";

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

  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Industry Professional UK Writers"
    },
    {
      icon: <MousePointerClick className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Try Before You Buy"
    },
    {
      icon: <UserCog className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Dedicated Account Managers"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="bg-transparent">
      <section className="relative isolate">
        <div className="relative min-h-[100svh]">
          <div className="absolute inset-0">
            <Image
              src="/images/virtual/header-bg.png"
              alt="Background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 md:pt-20">
            <motion.div
              className="text-center mt-8 md:mt-12"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1
                className="mb-4 md:mb-6 text-white"
                style={{ fontFamily: "Kabel" }}
                variants={fadeIn}
              >
                <motion.div className="mt-12 md:mt-20" variants={fadeIn}>
                  <span className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                    Ready, Set, Delegate!
                  </span>
                </motion.div>
                <motion.div className="mt-3 md:mt-4 lg:mt-6" variants={fadeIn}>
                  <span className="text-lg md:text-xl lg:text-4xl font-normal leading-relaxed">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </motion.div>
              </motion.h1>

              <motion.div className="mt-6 md:mt-8 lg:mt-12" variants={scaleIn}>
                <motion.button
                  className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-500 md:px-8 md:py-4 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BOOK A DISCOVERY CALL
                </motion.button>
              </motion.div>

              <motion.div
                className="mt-12 md:mt-16 lg:mt-32 flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-24 pb-12 md:pb-20 md:flex-row"
                variants={staggerChildren}
              >
                {benefits.map(({ text, iconPath, alt }) => (
                  <motion.div
                    key={text}
                    className="group flex items-center justify-center gap-3 md:gap-4 transition-all duration-300 w-full md:w-auto"
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={iconPath}
                        alt={alt}
                        width={48}
                        height={48}
                        className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8"
                      />
                    </motion.div>
                    <span className="text-base md:text-lg lg:text-xl font-bold text-white">
                      {text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Feature Carousel Section - Updated bottom padding */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mx-auto max-w-6xl pb-24 md:pb-12" // Increased bottom padding on mobile
            >
              <div className="w-full bg-black rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-16 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                  <div className="w-full md:w-1/3">
                    <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      BEST PLATFORM
                      <br />TO LEARN
                      <br />EVERYTHING
                    </h2>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <Carousel
                      opts={{
                        align: "center",
                        loop: true,
                      }}
                      className="w-full relative"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {features.map((feature, index) => (
                          <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                            <Card className="bg-yellow-400 border-none">
                              <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center space-y-3 md:space-y-4">
                                <div className="text-black">
                                  {feature.icon}
                                </div>
                                <h3 className="font-medium text-xs md:text-sm text-black">
                                  {feature.title}
                                </h3>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious 
                        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-12 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                      />
                      <CarouselNext 
                        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-10 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                      />
                    </Carousel>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;