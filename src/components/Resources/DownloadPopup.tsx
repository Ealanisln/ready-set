"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const LeadCaptureForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    industry: "",
    newsletter: false,
  });

  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    industry: string;
    newsletter: boolean;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically handle the form submission to your backend
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-32">
            <svg
              className="w-full"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 30L40 10L60 30" fill="black" />
              <circle cx="80" cy="20" r="5" fill="gold" />
            </svg>
          </div>
          <CardTitle className="mb-2 text-3xl font-bold">
            Thank you for signing up!
          </CardTitle>
          <p className="text-lg text-gray-600">
            Your free guide is on its way to your email.
          </p>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-center text-gray-500">
            Note: Kindly check your inbox for an email from us, and if it isn't
            there, please check your spam or junk folder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 w-32">
          <svg
            className="w-full"
            viewBox="0 0 100 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 30L40 10L60 30" fill="black" />
            <circle cx="80" cy="20" r="5" fill="gold" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold">
          Get Your Free Guide!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, newsletter: !!checked }))
                }
              />
              <label
                htmlFor="newsletter"
                className="text-sm leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to receive newsletters, updates, and promotional emails
                from Ready Set. I can unsubscribe at any time.
              </label>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Submit Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
