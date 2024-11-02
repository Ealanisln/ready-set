"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import FeatureCarousel from "./FeatureCarousel";
import { MaskBackground } from "./MaskBackground";

const HeroHeader = () => {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    staggerChildren: {
      visible: {
        transition: {
          staggerChildren: 0.2,
        },
      },
    },
    scaleIn: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
      },
    },
  };

  return (
    <div className="bg-transparent">
      <section className="relative isolate">
        <div className="relative isolate flex min-h-screen flex-col justify-between">
          {/* Background Image */}
          <div className="absolute inset-0 h-screen overflow-hidden">
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
          <MaskBackground />

          {/* Main Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 flex flex-col min-h-screen">
            <motion.div
              className="flex flex-col items-center justify-center flex-grow"
              initial="hidden"
              animate="visible"
              variants={animations.staggerChildren}
            >
              {/* Hero Title */}
              <motion.div
                className="text-center max-w-4xl mx-auto"
                variants={animations.fadeIn}
              >
                <h1 className="font-kabel text-white">
                  <span className="block text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                    Ready, Set, Delegate!
                  </span>
                  <span className="mt-4 block text-xl font-normal leading-relaxed md:text-2xl lg:text-4xl">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </h1>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="mt-12 md:mt-16"
                variants={animations.scaleIn}
              >
                <motion.button
                  className="rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-500 md:px-10 md:py-5 md:text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BOOK A DISCOVERY CALL
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Feature Carousel */}
            <motion.div
              className="w-full mb-12"
              variants={animations.fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <FeatureCarousel />
            </motion.div>
          </div>
          
          <MaskBackground />
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;