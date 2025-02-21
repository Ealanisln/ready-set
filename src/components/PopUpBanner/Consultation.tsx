"use client";

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ConsultationBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform border-none bg-transparent p-0 shadow-none">
          <VisuallyHidden asChild>
            <Dialog.Title>Book Your Free Consultation</Dialog.Title>
          </VisuallyHidden>
          <Dialog.Description className="hidden">
            Book a consultation and receive 10 free VA hours. Limited time
            offer.
          </Dialog.Description>

          <Card className="w-full bg-white">
            <CardContent className="p-8">
              <div className="flex justify-end">
                <Dialog.Close
                  className="text-2xl transition-colors hover:text-gray-600"
                  aria-label="Close dialog"
                >
                  &times;
                </Dialog.Close>
              </div>

              <h1 className="mb-4 text-center text-4xl font-bold">
                ONLY 20 SLOTS AVAILABLE
              </h1>

              <h2 className="mb-8 text-center text-2xl">
                Book a Consultation & Get 10 FREE
                <br />
                VA Hours!
              </h2>

              <div className="mx-auto w-full max-w-lg space-y-6">
                <div className="text-center">
                  <Button
                    className="inline-flex items-center justify-center rounded-xl bg-black px-16 py-3 text-xl font-bold text-white hover:bg-gray-800"
                    onClick={() => (window.location.href = "tel:4152266857")}
                  >
                    BOOK A CALL
                  </Button>
                </div>

                <div className="mb-2 flex items-center justify-center gap-2">
                  <Phone className="h-6 w-6" />
                  <a href="tel:4152266857" className="text-xl">
                    (415) 226-6857
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-4 gap-0">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="col-span-3 h-12 rounded-r-none border-r-0"
                      aria-label="Email Address"
                    />
                    <div className="flex h-12 items-center justify-center rounded-r bg-slate-800 text-white">
                      Email
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-0">
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="col-span-3 h-12 rounded-r-none border-r-0"
                      aria-label="Phone Number"
                    />
                    <div className="flex h-12 items-center justify-center rounded-r bg-slate-800 text-white">
                      Phone
                    </div>
                  </div>
                </form>

                <p className="text-center text-sm">
                  Limited offer this February 5 to 28, 2025.
                </p>
              </div>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConsultationBanner;
