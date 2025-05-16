'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScheduleDialog from '../Logistics/Schedule';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';

interface CateringDeliveryProps {
  onRequestQuote?: () => void;
}

const CateringDelivery: React.FC<CateringDeliveryProps> = ({ onRequestQuote }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [marginTopClass, setMarginTopClass] = useState('mt-0');
  const { openForm, DialogForm } = FormManager();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      updateMarginTopClass(window.innerWidth);
    };

    const updateMarginTopClass = (width: number) => {
      if (width < 768) {
        setMarginTopClass('mt-16');
      } else if (width < 1024) {
        setMarginTopClass('mt-20');
      } else {
        setMarginTopClass('mt-24');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleQuoteClick = () => {
    console.log('CateringHero - Get a quote clicked');
    openForm('food');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <section className={`relative min-h-[500px] w-full ${marginTopClass} bg-gray-50 mb-16 md:mb-24 lg:mb-32`}>
      <motion.div 
        className="relative mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-8 md:flex-row md:items-center md:py-12 lg:py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left content - Text */}
        <motion.div 
          className="relative z-10 w-full max-w-xl space-y-8 px-4 md:w-1/2 md:px-6 lg:px-8"
          variants={containerVariants}
        >
          <motion.h1 
            className="font-[Montserrat] text-2xl font-black leading-none tracking-tight text-gray-800 md:text-3xl lg:text-4xl"
            variants={itemVariants}
          >
            Your Go-To Catering
            <br />
            Delivery Partner Since
            <br />
            <motion.span 
              className="relative inline-block text-2xl text-yellow-400 md:text-3xl lg:text-4xl"
              variants={itemVariants}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              2019
            </motion.span>
          </motion.h1>

          <motion.p 
            className="font-[Montserrat] text-md font-medium leading-relaxed text-gray-900 md:text-lg lg:text-xl"
            variants={itemVariants}
          >
            Ready Set HQ, based in the San Francisco Bay Area, is expanding to Atlanta and Austin.
            We deliver daily team lunches, corporate events, and special occasions, trusted by top
            tech companies like Apple, Google, Facebook, and Netflix for our reliable catering
            delivery service.
          </motion.p>

          <motion.div 
            className="flex flex-wrap items-center gap-6 pt-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleQuoteClick}
              className="rounded-full bg-yellow-300 px-10 py-4 font-[Montserrat] text-lg font-extrabold text-gray-800 shadow-md transition-all hover:bg-yellow-400 hover:shadow-lg hover:translate-y-[-2px]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Get a Quote
            </motion.button>
            <ScheduleDialog
              buttonText="Book a Call"
              calendarUrl="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true"
              className="rounded-full bg-yellow-300 px-10 py-4 font-[Montserrat] text-lg font-extrabold text-gray-800 shadow-md transition-all hover:bg-yellow-400 hover:shadow-lg hover:translate-y-[-2px]"
            />
          </motion.div>
        </motion.div>

        {/* Right content - Image */}
        <motion.div 
          className="mt-12 flex w-full items-center justify-center md:mt-0 md:w-1/2 md:justify-end"
          variants={containerVariants}
        >
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-lg">
            {/* Yellow circular background with food bowl image */}
            <motion.div 
              className="relative mx-auto h-[320px] w-[320px] overflow-hidden rounded-full border-8 border-yellow-300 bg-yellow-300 md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]"
              variants={imageVariants}
              whileHover={{ rotate: 3, transition: { duration: 0.5 } }}
              animate={pulseAnimation}
            >
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Image
                  src="/images/food/salad-bowl.png"
                  alt="Catering food bowl with fresh ingredients"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 450px"
                  priority
                  className="scale-125"
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      {/* Render the dialog form */}
      {DialogForm}
    </section>
  );
};

export default CateringDelivery;
