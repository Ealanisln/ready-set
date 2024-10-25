"use client";

import Image from "next/image";
import Navbar from "@/components/Header";
import { motion } from "framer-motion";

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="bg-transparent">
      <nav className="relative z-50 bg-transparent">
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
            <motion.div 
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1 
                className="mb-6 text-white"
                style={{ fontFamily: "Kabel" }}
                variants={fadeIn}
              >
                <motion.div 
                  className="mt-2"
                  variants={fadeIn}
                >
                  <span className="text-6xl font-bold leading-tight">
                    Ready, Set, Delegate!
                  </span>
                </motion.div>
                <motion.div 
                  className="mt-6"
                  variants={fadeIn}
                >
                  <span className="text-2xl font-normal leading-relaxed md:text-4xl">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </motion.div>
              </motion.h1>

              <motion.div 
                className="mt-12"
                variants={scaleIn}
              >
                <motion.button 
                  className="rounded-full bg-amber-400 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BOOK A DISCOVERY CALL
                </motion.button>
              </motion.div>

              <motion.div 
                className="mt-32 flex flex-wrap justify-center gap-8 pb-20 md:gap-12 lg:flex-nowrap lg:gap-24"
                variants={staggerChildren}
              >
                {benefits.map(({ text, iconPath, description, alt }) => (
                  <motion.div
                    key={text}
                    className="group flex items-center gap-4 transition-all duration-300"
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className=""
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={iconPath}
                        alt={alt}
                        width={48}
                        height={48}
                        className="h-8 w-8"
                      />
                    </motion.div>
                    <span className="text-lg font-bold text-white">{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-0 left-0 right-0"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 1440 320"
              className="fill-white"
              preserveAspectRatio="none"
            >
              <path d="M0,160 C360,240 720,80 1080,160 C1260,200 1440,160 1440,160 L1440,320 L0,320 Z" />
            </svg>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;