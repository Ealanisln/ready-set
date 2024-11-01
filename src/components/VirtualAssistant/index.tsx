"use client";

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
      title: "Industry Professional UK Writers",
    },
    {
      icon: <MousePointerClick className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Try Before You Buy",
    },
    {
      icon: <UserCog className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Dedicated Account Managers",
    },
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
            <picture>
              <source srcSet="/images/virtual/header-bg.webp" type="image/webp" />
            <Image
              src="/images/virtual/header-bg.jpg"
              alt="Background"
              fill
              className="object-cover brightness-50"
              priority
            />
            </picture>
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 md:pt-20">
            <motion.div
              className="mt-8 text-center md:mt-12"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1
                className="mb-4 text-white md:mb-6"
                style={{ fontFamily: "Kabel" }}
                variants={fadeIn}
              >
                <motion.div className="mt-12 md:mt-20" variants={fadeIn}>
                  <span className="text-3xl font-bold leading-tight md:text-4xl lg:text-6xl">
                    Ready, Set, Delegate!
                  </span>
                </motion.div>
                <motion.div className="mt-3 md:mt-4 lg:mt-6" variants={fadeIn}>
                  <span className="text-lg font-normal leading-relaxed md:text-xl lg:text-4xl">
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
                className="mt-12 flex flex-col items-center justify-center gap-4 pb-12 md:mt-16 md:flex-row md:gap-6 md:pb-20 lg:mt-32 lg:gap-24"
                variants={staggerChildren}
              >
                {benefits.map(({ text, iconPath, alt }) => (
                  <motion.div
                    key={text}
                    className="group flex w-full items-center justify-center gap-3 transition-all duration-300 md:w-auto md:gap-4"
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
                    <span className="text-base font-bold text-white md:text-lg lg:text-xl">
                      {text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;
