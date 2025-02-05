// src/components/Newsletter/newsLetterSignUp.tsx
"use client";

import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import toast from "react-hot-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<"success" | "error" | "loading" | "idle">("idle");

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await axios.post("/api/subscribe", { email });
      setStatus("success");
      setEmail("");
      toast.success(response.data.message);
    } catch (err) {
      setStatus("error");
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.error || "An error occurred");
      }
    } finally {
      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="mt-4">
      <h3 className="mb-3 inline-block text-base text-gray-400">Subscribe to our</h3>
      <div className="mt-2.3">
        <h3 className="mb-3 inline-block text-base text-gray-400">Newsletter</h3>
        <form onSubmit={handleSubscribe} className="flex space-x-0.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`px-4 py-2 text-sm text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              status === "loading" 
                ? "bg-yellow-400 cursor-not-allowed" 
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;