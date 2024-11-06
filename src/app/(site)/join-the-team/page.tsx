"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, Headphones, Users } from "lucide-react";
import Link from "next/link";

export default function JoinOurTeam() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16 pt-36">
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Join Our Amazing Team!
          </h1>
          <p className="text-xl text-gray-600">
            We&apos;re always looking for great talent to help us grow
          </p>
        </header>

        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105">
            <Truck className="mb-4 h-12 w-12 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Catering Deliveries
            </h2>
            <p className="mb-4 text-gray-600">
              Do you have experience in catering deliveries? Join our team and
              help us deliver exceptional dining experiences to our clients.
            </p>
            <Button className="bg-yellow-400 text-gray-800 hover:bg-yellow-500">
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105">
            <Headphones className="mb-4 h-12 w-12 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Virtual Assistant
            </h2>
            <p className="mb-4 text-gray-600">
              Are you a talented virtual assistant? Put your skills to work and
              help our team stay organized and efficient.
            </p>
            <Button asChild>
              <Link
                href="/va"
                className="flex items-center bg-yellow-400 !text-gray-800 hover:bg-yellow-500"
              >
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-gray-800">
            Don&apos;t see your perfect role?
          </h2>
          <p className="mb-6 text-xl text-gray-600">
            We&apos;re always on the lookout for great talent. Let us know how
            you can contribute!
          </p>
          <Button className="bg-gray-800 text-white hover:bg-gray-900">
            <Users className="mr-2 h-5 w-5" /> Join Our Talent Pool
          </Button>
        </div>

        <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Interested? Get in Touch!
          </h2>
          {formSubmitted ? (
            <p className="text-green-600">
              Thank you for your interest! We&apos;ll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input type="text" placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email" required />
                <Textarea
                  placeholder="Tell us about your experience and interests"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
