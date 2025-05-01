'use client';
import React, { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';
import AppointmentDialog from '../VirtualAssistant/Appointment';
import dynamic from 'next/dynamic';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.15,
      duration: 0.4,
    },
  }),
};

const ClientSidePromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarUrl =
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true';

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed bottom-0 left-0 right-0 top-0 z-50 mx-auto my-auto h-fit w-full max-w-2xl p-4 sm:p-6"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                <VisuallyHidden asChild>
                  <Dialog.Title>Special Promotion - First Delivery Free</Dialog.Title>
                </VisuallyHidden>
                <Dialog.Description className="hidden">
                  Get your first delivery free up to $599 in food cost within a 10-mile radius
                </Dialog.Description>
                <Card className="relative w-full overflow-y-auto bg-gray-800 text-white">
                  <CardContent className="space-y-4 p-4 sm:space-y-8 sm:p-8">
                    <Dialog.Close className="absolute right-2 top-2 text-gray-400 transition-colors hover:text-white sm:right-4 sm:top-4">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <X size={24} aria-label="Close dialog" />
                      </motion.div>
                    </Dialog.Close>

                    <motion.h1
                      className="text-center text-4xl font-bold leading-tight tracking-wide sm:text-3xl"
                      variants={textVariants}
                      custom={0}
                    >
                      ONLY 50 SLOTS AVAILABLE
                    </motion.h1>

                    <motion.div
                      className="space-y-2 text-center sm:space-y-3"
                      variants={textVariants}
                      custom={1}
                    >
                      <p className="text-lg sm:text-xl">
                        Get your 1ST DELIVERY FREE
                        <span className="ml-2 text-lg sm:text-xl">(up to $599 in food cost)</span>
                      </p>
                      <p className="text-lg sm:text-xl">within a 10-mile radius!</p>
                    </motion.div>

                    <motion.div
                      className="space-y-4 sm:space-y-6"
                      variants={textVariants}
                      custom={2}
                    >
                      <motion.div
                        className="space-y-2 border border-dashed border-gray-500 p-3 text-sm sm:p-6 sm:text-base"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                      >
                        <p>• Extra charges beyond 10 miles</p>
                        <p>• Orders above $599 may require additional payment</p>
                        <p>• Sign-up requirement at readysetllc.com</p>
                      </motion.div>

                      <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex w-full justify-center"
                        >
                          <AppointmentDialog
                            buttonText="BOOK A CALL"
                            buttonClassName="inline-flex items-center bg-gray-300 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-400 sm:py-3 sm:text-base justify-center w-auto"
                            dialogTitle="Schedule Your Free Consultation"
                            dialogDescription="Book your consultation and receive 10 free VA hours!"
                            calendarUrl={calendarUrl}
                            buttonVariant="default"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        className="flex items-center justify-center gap-2 text-xl sm:gap-3 sm:text-2xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Phone size={1} className="sm:size-10" />
                        <a href="tel:4152266857" className="hover:underline">
                          (415) 226-6857
                        </a>
                      </motion.div>
                    </motion.div>

                    <motion.p
                      className="text-center text-base sm:text-lg"
                      variants={textVariants}
                      custom={3}
                    >
                      Limited-time offer from May 1 to 31, 2025.{' '}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

// Create a dynamically imported version with no SSR
const PromoPopup = dynamic(() => Promise.resolve(ClientSidePromoPopup), {
  ssr: false,
});

export default PromoPopup;
