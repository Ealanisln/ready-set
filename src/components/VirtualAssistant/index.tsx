// src/components/VirtualAssistant/index.tsx

"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import FeatureCarousel from "./FeatureCarousel";

const HeroHeader = () => {
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
        <div className="relative min-h-[100svh] flex items-center justify-center">
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
          <div className="relative z-10 mx-auto max-w-6xl px-4 w-full">
            <motion.div
              className="flex flex-col items-center justify-center"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1
                className="mb-4 text-white text-center md:mb-6"
                style={{ fontFamily: "Kabel" }}
                variants={fadeIn}
              >
                <motion.div
                  className="flex justify-center mt-12 md:mt-20"
                  variants={fadeIn}
                >
                  <span className="text-3xl font-bold leading-tight md:text-4xl lg:text-6xl">
                    Ready, Set, Delegate!
                  </span>
                </motion.div>
                <motion.div
                  className="flex justify-center mt-3 md:mt-4 lg:mt-6"
                  variants={fadeIn}
                >
                  <span className="text-lg font-normal leading-relaxed md:text-xl lg:text-4xl">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </motion.div>
              </motion.h1>
              <motion.div
                className="flex justify-center mt-6 md:mt-8 lg:mt-12"
                variants={scaleIn}
              >
                <motion.button
                  className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-500 md:px-8 md:py-4 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BOOK A DISCOVERY CALL
                </motion.button>
              </motion.div>
              {/* Feature Carousel Section */}
              <motion.div 
                className="mt-8 w-full"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <FeatureCarousel />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;