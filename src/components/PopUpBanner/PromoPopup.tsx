"use client";
import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentDialog from "../VirtualAssistant/Appointment";
import dynamic from "next/dynamic";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.15,
      duration: 0.4
    }
  })
};

const ClientSidePromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarUrl =
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0J6woLwahSRd6c1KrJ_X1cOl99VPr6x-Rp240gi87kaD28RsU1rOuiLVyLQKleUqoVJQqDEPVu?gv=true";

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
                className="fixed left-0 right-0 top-0 bottom-0 z-50 mx-auto my-auto h-fit w-full max-w-2xl border-none bg-transparent p-6 shadow-none"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                <VisuallyHidden asChild>
                  <Dialog.Title>Special Promotion - First Delivery Free</Dialog.Title>
                </VisuallyHidden>
                <Dialog.Description className="hidden">
                  Get your first delivery free up to $599 in food cost within a
                  10-mile radius
                </Dialog.Description>
                <Card className="relative w-full bg-gray-800 text-white">
                  <CardContent className="space-y-8 p-8">
                    <Dialog.Close
                      className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={24} aria-label="Close dialog" />
                      </motion.div>
                    </Dialog.Close>
                    
                    <motion.h1
                      className="text-center text-3xl font-bold leading-tight tracking-wide"
                      variants={textVariants}
                      custom={0}
                    >
                      ONLY 50 SLOTS AVAILABLE
                    </motion.h1>
                    
                    <motion.div
                      className="space-y-3 text-center"
                      variants={textVariants}
                      custom={1}
                    >
                      <p className="text-xl">
                        Get your 1ST DELIVERY FREE
                        <span className="ml-2 text-xl">
                          (up to $599 in food cost)
                        </span>
                      </p>
                      <p className="text-xl">within a 10-mile radius!</p>
                    </motion.div>
                    
                    <motion.div
                      className="space-y-6"
                      variants={textVariants}
                      custom={2}
                    >
                      <motion.div
                        className="text-md space-y-2 border border-dashed border-gray-500 p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                      >
                        <p>• Extra charges beyond 10 miles</p>
                        <p>• Orders above $599 may require additional payment</p>
                        <p>• Sign-up requirement at readysetllc.com</p>
                      </motion.div>
                      
                      <div className="flex flex-col items-center gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <AppointmentDialog
                            buttonText="BOOK A CALL"
                            buttonClassName="inline rounded-lg bg-[#CCCCCC] py-4 px-8 text-xl font-semibold text-[#333333] hover:bg-[#BBBBBB] flex items-center justify-center gap-2"
                            dialogTitle="Schedule Your Free Consultation"
                            dialogDescription="Book your consultation and receive 10 free VA hours!"
                            calendarUrl={calendarUrl}
                            buttonVariant="black"
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div
                        className="flex items-center justify-center gap-3 text-2xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Phone size={28} />
                        <a href="tel:4152266857" className="hover:underline">
                          (415) 226-6857
                        </a>
                      </motion.div>
                    </motion.div>
                    
                    <motion.p
                      className="text-center text-lg"
                      variants={textVariants}
                      custom={3}
                    >
                      Limited offer this February 5 to 28, 2025.
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