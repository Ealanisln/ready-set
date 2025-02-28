"use client";

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentDialog from "../VirtualAssistant/Appointment";
import dynamic from "next/dynamic";

// Framer Motion variants for animations
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.5,
    },
  }),
};

const ClientSideConsultationBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed bottom-0 left-0 right-0 top-0 mx-auto my-auto h-fit w-full max-w-2xl border-none bg-transparent p-6 shadow-none"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                <VisuallyHidden asChild>
                  <Dialog.Title>Book Your Free Consultation</Dialog.Title>
                </VisuallyHidden>
                <Dialog.Description className="hidden">
                  Book a consultation and receive 10 free VA hours. Limited time
                  offer.
                </Dialog.Description>
                <Card className="w-full bg-white">
                  <CardContent className="p-12">
                    <div className="flex justify-end">
                      <Dialog.Close
                        className="text-2xl transition-colors hover:text-gray-600"
                        aria-label="Close dialog"
                      >
                        &times;
                      </Dialog.Close>
                    </div>
                    <div className="space-y-8">
                      <motion.h1
                        className="text-center text-4xl font-bold"
                        variants={textVariants}
                        custom={0}
                      >
                        ONLY 20 SLOTS AVAILABLE
                      </motion.h1>
                      <motion.h2
                        className="text-center text-2xl"
                        variants={textVariants}
                        custom={1}
                      >
                        Book a Consultation & Get 10 FREE
                        <br />
                        VA Hours!
                      </motion.h2>
                      <motion.div
                        className="flex flex-col items-center gap-6"
                        variants={textVariants}
                        custom={2}
                      >
                        <AppointmentDialog
                          buttonText="BOOK A CALL"
                          buttonClassName="inline-flex items-center justify-center rounded-xl bg-black px-16 py-6 text-xl font-bold text-white hover:bg-gray-800"
                          dialogTitle="Schedule Your Free Consultation"
                          dialogDescription="Book your consultation and receive 10 free VA hours!"
                          calendarUrl={calendarUrl}
                          buttonVariant="black"
                        />
                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Phone className="h-8 w-8" />
                          <a href="tel:4152266857" className="text-2xl">
                            (415) 226-6857
                          </a>
                        </motion.div>
                      </motion.div>
                      <motion.p
                        className="text-center text-lg"
                        variants={textVariants}
                        custom={3}
                      >
                        Limited-time offer from March 1 to 15, 2025.{" "}
                      </motion.p>
                    </div>
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
const ConsultationBanner = dynamic(
  () => Promise.resolve(ClientSideConsultationBanner),
  { ssr: false },
);

export default ConsultationBanner;
