

// src/components/QuoteRequestForm.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { sendQuoteEmail } from "@/app/actions/quote-email";

interface QuoteFormInputs {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  message: string;
}

interface MessageState {
  type: "success" | "error";
  text: string;
}

export const QuoteRequestForm = () => {
  const [message, setMessage] = useState<MessageState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormInputs>();

  const onSubmit: SubmitHandler<QuoteFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await sendQuoteEmail(data);
      setMessage({ type: "success", text: result });
      reset();
    } catch (error: unknown) {
      let errorMessage = "We're sorry, there was an error sending your quote request.";
      if (error instanceof Error) {
        errorMessage += " " + error.message;
      }
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (message?.type === "success") {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Check className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-xl font-bold text-gray-900">Quote Request Sent!</h3>
          <p className="text-gray-700">{message.text}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Request a Quote
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            {...register("companyName", { required: true })}
            type="text"
            placeholder="Company Name"
            className="w-full"
          />
          {errors.companyName && (
            <span className="mt-1 text-sm text-red-500">Company name is required</span>
          )}
        </div>

        <div>
          <Input
            {...register("contactPerson", { required: true })}
            type="text"
            placeholder="Contact Person"
            className="w-full"
          />
          {errors.contactPerson && (
            <span className="mt-1 text-sm text-red-500">Contact person is required</span>
          )}
        </div>

        <div>
          <Input
            {...register("email", {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
            type="email"
            placeholder="Business Email"
            className="w-full"
          />
          {errors.email && (
            <span className="mt-1 text-sm text-red-500">
              {errors.email.type === "pattern"
                ? "Please enter a valid email"
                : "Email is required"}
            </span>
          )}
        </div>

        <div>
          <Input
            {...register("phone", { required: true })}
            type="tel"
            placeholder="Phone Number"
            className="w-full"
          />
          {errors.phone && (
            <span className="mt-1 text-sm text-red-500">Phone number is required</span>
          )}
        </div>

        <div>
          <Textarea
            {...register("message", { required: true })}
            placeholder="Tell us about your catering delivery needs"
            className="min-h-[120px] w-full"
          />
          {errors.message && (
            <span className="mt-1 text-sm text-red-500">Message is required</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 py-6 text-gray-800 hover:bg-yellow-500"
        >
          {isSubmitting ? "Sending..." : "Get Quote"}
        </Button>

        {message?.type === "error" && (
          <div className="mt-4 rounded bg-red-100 p-3 text-red-800">
            {message.text}
          </div>
        )}
      </form>
    </Card>
  );
};