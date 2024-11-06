"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, Headphones, Users, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ButtonLinkProps {
  href: string;
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
  delay: number;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  icon,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      <Link href={href} className="group block">
        <motion.div
          className="flex h-full flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="mb-2 text-primary sm:mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          <h2 className="mb-1 text-balance text-xl font-semibold text-gray-800 dark:text-gray-100 sm:mb-2 sm:text-2xl">
            {title}
          </h2>
          <p className="text-balance text-center text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            {description}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const logoSources = {
    webp: "/images/logo/full-logo-dark.webp",
    fallback: "/images/logo/full-logo-dark.png",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 pt-8 sm:pt-12">
      {/* Fixed background div */}
      <div className="fixed inset-0 -z-10">
        <picture>
          <source srcSet="/images/hero/hero-bg.webp" type="image/webp" />
          <img
            src="/images/hero/hero-bg.jpg"
            alt="Hero background"
            className="h-full w-full object-cover brightness-50"
          />
        </picture>
      </div>
      
      <motion.header
        className="mb-12 flex w-full flex-col items-center px-4 text-center sm:mb-16 sm:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto w-full max-w-[600px]">
          <motion.h1
            className="mb-6 mt-6 text-balance text-3xl font-bold text-yellow-400 sm:mb-8 sm:mt-8 sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Ready Set Group LLC
          </motion.h1>
        </div>

        <motion.div
          className="relative mb-6 h-[200px] w-[300px] sm:mb-10 sm:h-[300px] sm:w-[400px] md:h-[400px] md:w-[500px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative h-full w-full">
            <picture>
              <source srcSet={logoSources.webp} type="image/webp" />
              <Image
                src={logoSources.fallback}
                alt="Ready Set Group LLC Logo"
                fill
                sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, 500px"
                className="object-contain"
                priority
              />
            </picture>
          </div>
        </motion.div>

        <motion.p
          className="mt-4 text-balance text-xl text-yellow-400 dark:text-gray-200 sm:mt-6 sm:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          How can we help?
        </motion.p>
      </motion.header>

      <motion.div
        className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ButtonLink
          href="/logistics"
          icon={
            <Truck
              strokeWidth={1.5}
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
            />
          }
          title="Logistics"
          description="Streamline your supply chain with our logistics solutions"
          delay={0.9}
        />
        <ButtonLink
          href="/va"
          icon={
            <Headphones
              strokeWidth={1.5}
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
            />
          }
          title="Virtual Assistant"
          description="Reclaim your time and boost your productivity!"
          delay={1.1}
        />
        <ButtonLink
          href="/join-the-team"
          icon={
            <Users
              strokeWidth={1.5}
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
            />
          }
          title="Join the Team"
          description="Explore various exciting positions available in our growing company"
          delay={1.3}
        />
      </motion.div>
    </div>
  );
};

export default LandingPage;