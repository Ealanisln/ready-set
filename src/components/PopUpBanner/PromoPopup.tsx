"use client";

import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    setIsOpen(true);
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform border-none bg-transparent p-0 shadow-none">
          <VisuallyHidden asChild>
            <Dialog.Title>Special Promotion - First Delivery Free</Dialog.Title>
          </VisuallyHidden>
          <Dialog.Description className="hidden">
            Get your first delivery free up to $599 in food cost within a
            10-mile radius
          </Dialog.Description>

          <Card className="relative w-full bg-gray-800 text-white">
            <CardContent className="space-y-4 p-4 sm:p-5">
              <Dialog.Close className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-white">
                <X size={20} aria-label="Close dialog" />
              </Dialog.Close>

              <h1 className="text-center text-2xl font-bold leading-tight tracking-wide sm:text-3xl">
                ONLY 50 SLOTS AVAILABLE
              </h1>

              <div className="space-y-1 text-center">
                <p className="text-lg sm:text-xl">
                  Get your 1ST DELIVER FREE
                  <span className="ml-1 text-sm sm:text-base">
                    (up to $599 in food cost)
                  </span>
                </p>
                <p className="text-lg sm:text-xl">within a 10-mile radius!</p>
              </div>

              <div className="space-y-6 p-4">
                <div className="space-y-1 border border-dashed border-gray-500 p-3 text-sm">
                  <p>• Extra charges beyond 10 miles</p>
                  <p>• Orders above $599 may require additional payment</p>
                  <p>• Sign-up requirement at readysetllc.com</p>
                </div>

                <Button
                  className="w-full bg-gray-300 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-400 sm:text-base"
                  onClick={() => (window.location.href = "tel:4152266857")}
                >
                  BOOK A CALL
                </Button>

                <div className="flex items-center justify-center gap-2 text-base">
                  <Phone size={18} />
                  <a href="tel:4152266857" className="hover:underline">
                    (415) 226-6857
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full grid-cols-5 overflow-hidden rounded">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="col-span-3 h-9 rounded-r-none border-0 bg-white px-3 text-sm text-gray-600 sm:h-10 sm:text-base"
                      aria-label="Email Address"
                      placeholder="Enter your email"
                    />
                    <div className="col-span-2 flex h-9 items-center justify-center whitespace-nowrap bg-gray-300 px-3 text-sm text-gray-600 sm:h-10 sm:text-base">
                      Email Address
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-5 overflow-hidden rounded">
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="col-span-3 h-9 rounded-r-none border-0 bg-white px-3 text-sm text-gray-600 sm:h-10 sm:text-base"
                      aria-label="Phone Number"
                      placeholder="Enter your phone"
                    />
                    <div className="col-span-2 flex h-9 items-center justify-center whitespace-nowrap bg-gray-300 px-3 text-sm text-gray-600 sm:h-10 sm:text-base">
                      Phone Number
                    </div>
                  </div>
                </form>
              </div>

              <p className="text-center text-xs sm:text-sm">
                Limited offer this February 5 to 28, 2025.
              </p>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PromoPopup;
