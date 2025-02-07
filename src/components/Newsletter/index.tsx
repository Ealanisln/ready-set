"use client";

import React, { FormEvent, useState } from "react";
import { Loader2, Check, Mail, ArrowRight, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type StatusType = "idle" | "loading" | "success" | "error";

interface ApiResponse {
  message: string;
  error?: string;
}

interface SubscribeProps {
  className?: string;
  onSuccess?: (email: string) => void;
}

interface UnsubscribeProps {
  className?: string;
  onSuccess?: (email: string) => void;
}

export const Subscribe: React.FC<SubscribeProps> = ({
  className = "",
  onSuccess,
}) => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number | undefined>();

  async function handleSubscribe(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const data: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      setStatus("success");
      setStatusCode(response.status);
      setResponseMsg(data.message || "Successfully subscribed to the newsletter!");
      setEmail("");
      onSuccess?.(email);
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setResponseMsg(err.message);
      } else {
        setResponseMsg("Failed to subscribe. Please try again later.");
      }
      setStatusCode(400);
    }
  }

  return (
    <div className={`w-full max-w-lg mx-auto p-6 ${className}`.trim()}>
      <div className="rounded-xl bg-white shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Stay Updated
          </h2>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Join our newsletter for exclusive updates, tips, and special offers.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className={`w-full px-4 py-3 rounded-lg border-2 pr-12 transition-colors
                focus:outline-none focus:ring-2 focus:ring-yellow-500/20
                ${statusCode === 400 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-gray-200 focus:border-yellow-500"
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {status === "loading" && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              {status === "success" && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {status === "error" && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
              bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300
              text-white font-medium transition-colors w-full"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {(status === "success" || status === "error") && (
          <Alert className={`mt-4 ${
            status === "success" ? "bg-green-50" : "bg-red-50"
          }`}>
            <AlertDescription className={
              status === "success" ? "text-green-800" : "text-red-800"
            }>
              {responseMsg}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export const Unsubscribe: React.FC<UnsubscribeProps> = ({
  className = "",
  onSuccess,
}) => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number | undefined>();

  async function handleUnsubscribe(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      
      const data: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }
      
      setStatus("success");
      setStatusCode(response.status);
      setResponseMsg(data.message || "Successfully unsubscribed from the newsletter");
      setEmail("");
      onSuccess?.(email);
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setResponseMsg(err.message);
      } else {
        setResponseMsg("Failed to unsubscribe. Please try again later.");
      }
      setStatusCode(400);
    }
  }

  return (
    <div className={`w-full max-w-lg mx-auto p-6 ${className}`.trim()}>
      <div className="rounded-xl bg-white shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Unsubscribe from Updates
          </h2>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          We're sad to see you go. Enter your email to unsubscribe from our newsletter.
        </p>

        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className={`w-full px-4 py-3 rounded-lg border-2 pr-12 transition-colors
                focus:outline-none focus:ring-2 focus:ring-red-500/20
                ${statusCode === 400 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-gray-200 focus:border-red-500"
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {status === "loading" && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
              {status === "success" && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {status === "error" && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
              bg-red-500 hover:bg-red-600 disabled:bg-gray-300
              text-white font-medium transition-colors w-full"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Unsubscribe"
            )}
          </button>
        </form>

        {(status === "success" || status === "error") && (
          <Alert className={`mt-4 ${
            status === "success" ? "bg-green-50" : "bg-red-50"
          }`}>
            <AlertDescription className={
              status === "success" ? "text-green-800" : "text-red-800"
            }>
              {responseMsg}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};