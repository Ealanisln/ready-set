// components/Hero/index.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, Headphones, Users, LucideIcon } from "lucide-react";
import { motion, MotionProps } from "framer-motion";

// Type definitions
interface ButtonLinkProps {
  href: string;
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
  delay: number;
}

// Motion component types
type MotionDivProps = Omit<React.HTMLProps<HTMLDivElement>, keyof MotionProps> & MotionProps;

// Custom motion components
const MotionDiv: React.FC<MotionDivProps> = motion('div');
const MotionHeader: React.FC<MotionDivProps> = motion('header');
const MotionHeading: React.FC<MotionDivProps> = motion('h2');

const ButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  icon,
  title,
  description,
  delay,
}) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      <Link href={href} className="group block">
        <MotionDiv
          initial={false}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="flex h-full flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6"
        >
          <MotionDiv
            initial={false}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-primary sm:mb-4"
          >
            {icon}
          </MotionDiv>
          <h3 className="mb-1 text-balance text-xl font-semibold text-gray-800 dark:text-gray-100 sm:mb-2 sm:text-2xl">
            {title}
          </h3>
          <p className="text-balance text-center text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            {description}
          </p>
        </MotionDiv>
      </Link>
    </MotionDiv>
  );
};

const Hero: React.FC = () => {
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
    <section className="relative min-h-screen p-4">
      {/* Hidden SEO content */}
      <div className="sr-only" role="complementary" aria-label="Company Overview">
        <h1>Ready Set Group LLC - Bay Area&apos;s Premier Business Solutions Provider</h1>
        <p>Ready Set Group LLC, founded in 2019, has established itself as a cornerstone of Silicon Valley&apos;s business infrastructure. Our comprehensive suite of services, including specialized catering delivery and virtual assistant solutions, has earned the trust of industry leaders like Apple, Google, and Facebook. As a HIPAA-compliant and food safety-certified organization, we maintain the highest standards of professionalism and reliability across the Bay Area.</p>
        
        <div role="navigation" aria-label="Main Services">
          <h2>Our Comprehensive Service Portfolio</h2>
          <ul>
            <li>
              <h3>Logistics Excellence</h3>
              <p>Our logistics division specializes in time-sensitive deliveries, handling everything from corporate catering to specialized item transport. We maintain strict food safety protocols and offer same-day delivery options across the Bay Area.</p>
            </li>
            <li>
              <h3>Virtual Assistant Solutions</h3>
              <p>Our VA services support diverse sectors including real estate, education, and retail. We provide comprehensive administrative support, from order management to customer service, all backed by our commitment to confidentiality and efficiency.</p>
            </li>
            <li>
              <h3>Career Growth Opportunities</h3>
              <p>Join our dynamic team of professionals serving Silicon Valley&apos;s most innovative companies. We offer competitive positions in logistics, customer service, and administrative support roles.</p>
            </li>
          </ul>
        </div>
        
        <div role="contentinfo" aria-label="Company Highlights">
          <h2>Why Choose Ready Set Group LLC?</h2>
          <ul>
            <li>HIPAA-compliant operations ensuring data security</li>
            <li>Food safety certified delivery services</li>
            <li>Trusted partner to Silicon Valley&apos;s leading tech companies</li>
            <li>Comprehensive business support solutions</li>
            <li>Professional team with industry expertise</li>
            <li>Flexible service options tailored to client needs</li>
          </ul>
        </div>
      </div>

      {/* Visual content */}
      <div className="fixed inset-0 -z-20 bg-primary" />
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hero/hero-bg.webp"
          alt="Hero background"
          fill
          className="object-cover mix-blend-multiply"
          priority
          quality={100}
          onError={(e) => {
            const imgElement = e.currentTarget;
            imgElement.src = '/images/hero/hero-bg.png';
          }}
        />
      </div>

      <div className="flex min-h-screen flex-col items-center">
        <MotionHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center px-4 sm:px-6 pt-8 sm:pt-16"
        >
          <MotionDiv
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative h-[200px] w-[300px] sm:h-[300px] sm:w-[400px] md:h-[400px] md:w-[500px]"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/logo/logo-white.png"
                alt="Ready Set Group LLC Logo"
                fill
                sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, 500px"
                className="object-contain"
                priority
              />
            </div>
          </MotionDiv>

          <MotionHeading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 text-balance text-xl text-black dark:text-gray-200 sm:mt-6 sm:text-2xl"
          >
            How can we help?
          </MotionHeading>
        </MotionHeader>

        <div className="flex-1" />

        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-12 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8"
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
        </MotionDiv>
      </div>
    </section>
  );
};

export default Hero;