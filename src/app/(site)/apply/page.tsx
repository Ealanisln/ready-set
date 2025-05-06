// "use client"; // Remove this line

import type { Metadata } from "next";
// Remove the JoinOurTeam import as we'll use its structure directly
// import JoinOurTeam from "@/components/JoinTheTeam/index"; 
// Import the JobApplicationForm
import JobApplicationForm from "@/components/Apply/ApplyForm"; 
// Import components previously used in JoinOurTeam
import { Truck, Headphones, ArrowRight, ChevronDown } from "lucide-react";
import { CateringModal } from "@/components/JoinTheTeam/CateringModal";
import { VAModal } from "@/components/JoinTheTeam/VAModal";
// Keep TalentPoolModal import in case needed later, but won't render it now
// import { TalentPoolModal } from "@/components/JoinTheTeam/TalentPoolModal";

export const metadata: Metadata = {
  title: "Apply to Join Our Team | Ready Set Group LLC Careers",
  description: "Apply for catering delivery, virtual assistant, and other positions at Ready Set Group LLC. Join the Bay Area's premier business solutions provider.",
  keywords: [
    "apply for jobs",
    "career opportunities", 
    "jobs in Bay Area",
    "catering delivery jobs",
    "virtual assistant positions",
    "logistics careers",
    "Silicon Valley jobs",
    "flexible work opportunities",
    "delivery driver jobs",
    "remote work positions",
    "professional VA jobs",
    "food delivery careers",
    "administrative positions",
    "Bay Area employment",
    "logistics team jobs",
    "career growth"
  ],
  openGraph: {
    title: "Apply Now | Ready Set Group LLC Careers",
    description: "Submit your application to join the Ready Set Group team. We offer competitive positions in logistics and virtual assistance.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Careers | Ready Set Group LLC",
    description: "Interested in joining our team? Apply now for logistics and virtual assistant roles.",
  },
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient Overlay */}
      <section className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 py-20 pt-36">
        <div className="absolute inset-0 bg-black/5 pattern-grid-lg"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Join Our Team
            </h1>
            <p className="text-lg text-white/90">
              Be part of something great. We're looking for talented people to help us grow.
            </p>
            <a 
              href="#apply-now" 
              className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 font-medium text-yellow-600 shadow-lg transition hover:bg-gray-50"
            >
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Explore our current openings and find your perfect role
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2">
            {/* Catering Deliveries Card */}
            <div className="group overflow-hidden rounded-xl bg-white shadow-xl transition">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-1">
                <div className="bg-white p-6">
                  <Truck className="mb-4 h-10 w-10 text-yellow-500" />
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900">
                    Catering Deliveries
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Help us deliver exceptional dining experiences to our clients throughout the Bay Area.
                  </p>
                  <ul className="mb-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Flexible schedule
                    </li>
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Competitive pay
                    </li>
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Growth opportunities
                    </li>
                  </ul>
                  <CateringModal />
                </div>
              </div>
            </div>

            {/* Virtual Assistant Card */}
            <div className="group overflow-hidden rounded-xl bg-white shadow-xl transition">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-1">
                <div className="bg-white p-6">
                  <Headphones className="mb-4 h-10 w-10 text-yellow-500" />
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900">
                    Virtual Assistant
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Put your organizational skills to work and help our team stay efficient remotely.
                  </p>
                  <ul className="mb-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Remote work
                    </li>
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Flexible hours
                    </li>
                    <li className="flex items-center">
                      <ChevronDown className="mr-2 h-4 w-4 rotate-[-90deg] text-yellow-500" />
                      Professional development
                    </li>
                  </ul>
                  <VAModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-now" className="relative bg-gray-50 py-20">
        <div className="absolute inset-0 opacity-10 pattern-dots-xl"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
                Apply Now
              </h2>
              <p className="text-lg text-gray-600">
                Take the first step toward joining our team
              </p>
            </div>
            
            <JobApplicationForm />
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Join Ready Set Group?
            </h2>
            <p className="text-xl text-gray-600">
              We're more than just a company - we're a community
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Competitive Pay</h3>
              <p className="text-gray-600">We value your contribution and compensate you fairly for your expertise.</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Growth Opportunities</h3>
              <p className="text-gray-600">We're committed to your professional development and career advancement.</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Supportive Team</h3>
              <p className="text-gray-600">Join a collaborative environment where everyone helps each other succeed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}