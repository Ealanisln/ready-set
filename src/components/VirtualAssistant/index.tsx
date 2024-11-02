"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import FeatureCarousel from "./FeatureCarousel";
import { MaskBackground } from "./MaskBackground";

const HeroHeader = () => {
  // Animations configuration
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
          <div className="absolute inset-0 h-[78vh] overflow-hidden">
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
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-16 md:pt-20 lg:pt-24">
            <motion.div
              className="flex flex-col items-center"
              initial="hidden"
              animate="visible"
              variants={animations.staggerChildren}
            >
              {/* Hero Title */}
              <motion.div
                className="text-center"
                variants={animations.fadeIn}
              >
                <h1 className="font-kabel text-white">
                  <span className="block text-3xl font-bold leading-tight md:text-5xl lg:text-6xl pt-24">
                    Ready, Set, Delegate!
                  </span>
                  <span className="mt-3 block text-lg font-normal leading-relaxed md:mt-4 md:text-xl lg:mt-6 lg:text-4xl">
                    Expert Virtual Assistants, Ready When You Are.
                  </span>
                </h1>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="mt-8 md:mt-10 lg:mt-12 pt-16"
                variants={animations.scaleIn}
              >
                <motion.button
                  className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-500 md:px-8 md:py-4 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BOOK A DISCOVERY CALL
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature Carousel */}
          <motion.div
            className="relative z-10 w-full mt-auto pb-10"
            variants={animations.fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <FeatureCarousel />
          </motion.div>
          
          <MaskBackground />
        </div>
      </section>
    </div>
  );
};

export default HeroHeader;