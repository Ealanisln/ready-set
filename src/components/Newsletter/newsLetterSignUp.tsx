"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const NewsletterSignup = () => {
  const [status, setStatus] = useState("idle");
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <h3 className="mb-3 inline-block text-base text-gray-400">Subscribe to our</h3>
      <div className="mt-2.5">
        <h3 className="mb-3 inline-block text-base text-gray-400">Newsletter</h3>
        <div className="w-[300px]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                disabled={status === "loading"}
                className={`w-24 px-4 py-2 text-sm text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  status === "loading" 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-[#4361ee] hover:bg-blue-700"
                }`}
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden w-[95%] sm:w-full max-w-2xl mx-auto">
              <DialogHeader className="p-4 border-b">
                <div className="relative">
                  <DialogTitle className="text-xl font-semibold">
                    Newsletter Subscription
                  </DialogTitle>
                  <button 
                    onClick={() => setOpen(false)}
                    className="absolute -top-2 -right-2 p-1 rounded-full hover:bg-gray-100"
                  >
                  </button>
                </div>
              </DialogHeader>
              <iframe 
                src="https://cdn.forms-content-1.sg-form.com/1012de53-d41d-11ef-868a-3e15cbdb32e5"
                className="w-full h-[680px] border-0"
                title="Newsletter Subscription Form"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;