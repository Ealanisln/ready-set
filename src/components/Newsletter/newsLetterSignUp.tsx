"use client";

import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import toast from "react-hot-toast";
import Newsletter from '../Blog/Newsletter';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState<
    "success" | "error" | "loading" | "idle"
  >("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number>();

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await axios.post("/api/subscribe", { email });

      setStatus("success");
      setStatusCode(response.status);
      setEmail("");
      setResponseMsg(response.data.message);
      toast.success("Subscription was successful");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus("error");
        setStatusCode(err.response?.status);
        setResponseMsg(err.response?.data.error);
        toast.error(err.response?.data.error);

      }
    }
  }


  return (
    <div className="mt-4">
      <h3 className="mb-3 inline-block text-base text-gray-400">Subscribe to our</h3>
      <div className="mt-2.3">
      <h3 className="mb-3 inline-block text-base text-gray-400">Newsletter</h3>
      {!subscribed ? (
        <form onSubmit={handleSubscribe} className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-green-500">Thank you for subscribing!</p>
      )}
    </div>
    </div>
  );
};

export default NewsletterSignup;