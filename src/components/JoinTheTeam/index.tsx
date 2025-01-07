// components/JoinOurTeam/index.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, Headphones, Users } from "lucide-react";
import Link from "next/link";
import sendEmail from "@/app/actions/email";
import { CateringModal } from "./CateringModal";
import { VAModal } from "./VAModal";
import { TalentPoolModal } from "./TalentPoolModal";

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

interface MessageState {
  type: "success" | "error";
  text: string;
}

export default function JoinOurTeam() {
  const [message, setMessage] = useState<MessageState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const result = await sendEmail(data);

      setMessage({
        type: "success",
        text: "Thank you for your interest! We'll be in touch soon.",
      });

      setTimeout(() => {
        setMessage(null);
        reset();
      }, 3000);
    } catch (error: unknown) {
      let errorMessage =
        "We're sorry, there was an error sending your application.";

      if (error instanceof Error) {
        errorMessage += " " + error.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50">
      {/* Hidden SEO content */}
      <div
        className="sr-only"
        role="complementary"
        aria-label="Career Opportunities"
      >
        <h1>Career Opportunities at Ready Set Group LLC</h1>
        <p>
          Join the Bay Area&apos;s leading business solutions provider, offering
          exciting career opportunities in logistics, delivery services, and
          virtual assistance. Since 2019, we&apos;ve been providing exceptional
          service to Silicon Valley&apos;s top tech companies, and we&apos;re
          growing our team of dedicated professionals.
        </p>

        <div role="navigation" aria-label="Available Positions">
          <h2>Current Opportunities</h2>
          <div>
            <h3>Catering Delivery Specialists</h3>
            <ul>
              <li>Full-time and flexible schedule positions available</li>
              <li>
                Temperature-controlled vehicle operation experience preferred
              </li>
              <li>Food handling certification opportunities</li>
              <li>Competitive pay and benefits</li>
              <li>Growth opportunities within logistics operations</li>
              <li>Local routes throughout the Bay Area</li>
            </ul>
          </div>

          <div>
            <h3>Virtual Assistant Positions</h3>
            <ul>
              <li>Remote work opportunities available</li>
              <li>Administrative and customer service experience valued</li>
              <li>Full-time and part-time positions</li>
              <li>Training and professional development provided</li>
              <li>Opportunity to work with leading tech companies</li>
              <li>Flexible scheduling options</li>
            </ul>
          </div>
        </div>

        <div role="contentinfo" aria-label="Company Benefits">
          <h2>Why Work With Us?</h2>
          <ul>
            <li>Competitive compensation packages</li>
            <li>Health and wellness benefits</li>
            <li>Professional development opportunities</li>
            <li>Flexible scheduling options</li>
            <li>Positive work environment</li>
            <li>Career advancement pathways</li>
            <li>Team-oriented culture</li>
            <li>Regular recognition programs</li>
          </ul>

          <h3>Company Culture</h3>
          <p>
            At Ready Set Group LLC, we foster a culture of excellence,
            innovation, and mutual respect. Our team members enjoy a supportive
            environment where their contributions are valued and professional
            growth is encouraged. We prioritize work-life balance while
            maintaining our commitment to exceptional service.
          </p>
        </div>
      </div>

      {/* Existing visual content */}
      <div className="container mx-auto px-4 py-16 pt-36">
        {/* Rest of your existing JSX code... */}
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Join Our Amazing Team!
          </h1>
          <p className="text-xl text-gray-600">
            We&apos;re always looking for great talent to help us grow
          </p>
        </header>

        <div className="mb-16 grid gap-12 md:grid-cols-2">
          {/* Catering Deliveries Card */}
          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105">
            <Truck className="mb-4 h-12 w-12 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Catering Deliveries
            </h2>
            <p className="mb-4 text-gray-600">
              Do you have experience in catering deliveries? Join our team and
              help us deliver exceptional dining experiences to our clients.
            </p>
            <CateringModal />
          </div>

          {/* Virtual Assistant Card */}
          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105">
            <Headphones className="mb-4 h-12 w-12 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Virtual Assistant
            </h2>
            <p className="mb-4 text-gray-600">
              Are you a talented virtual assistant? Put your skills to work and
              help our team stay organized and efficient.
            </p>
            <VAModal />
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
        <h2 className="mb-4 text-3xl font-semibold text-gray-800">
            Don&apos;t see your perfect role?
          </h2>
          <p className="mb-6 text-xl text-gray-600">
            We&apos;re always on the lookout for great talent. Let us know how
            you can contribute!
          </p>
          <TalentPoolModal />
        </div>
      </div>
    </div>
  );
}
