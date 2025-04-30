// "use client"; // Remove this line

import type { Metadata } from "next";
// Remove the JoinOurTeam import as we'll use its structure directly
// import JoinOurTeam from "@/components/JoinTheTeam/index"; 
// Import the JobApplicationForm
import JobApplicationForm from "@/components/Apply/ApplyForm"; 
// Import components previously used in JoinOurTeam
import { Truck, Headphones } from "lucide-react";
import { CateringModal } from "@/components/JoinTheTeam/CateringModal";
import { VAModal } from "@/components/JoinTheTeam/VAModal";
// Keep TalentPoolModal import in case needed later, but won't render it now
// import { TalentPoolModal } from "@/components/JoinTheTeam/TalentPoolModal";

export const metadata: Metadata = {
  title: "Apply to Join Our Team | Ready Set Group LLC Careers", // Updated title slightly
  description: "Apply for catering delivery, virtual assistant, and other positions at Ready Set Group LLC. Join the Bay Area's premier business solutions provider.", // Updated description
  keywords: [
    "apply for jobs", // Added apply keyword
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
    title: "Apply Now | Ready Set Group LLC Careers", // Updated title
    description: "Submit your application to join the Ready Set Group team. We offer competitive positions in logistics and virtual assistance.", // Updated description
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Careers | Ready Set Group LLC", // Updated title
    description: "Interested in joining our team? Apply now for logistics and virtual assistant roles.", // Updated description
  },
};

export default function ApplyPage() {
  return (
    // Use a container and padding similar to the original JoinOurTeam page
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50 py-16 pt-36"> 
      <div className="container mx-auto px-4">
        {/* Header section */}
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Join Our Amazing Team! 
          </h1>
          <p className="text-xl text-gray-600">
            Explore opportunities and apply below.
          </p>
        </header>

        {/* Informational Cards Section (from JoinOurTeam structure) */}
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
        
        {/* Separator or Header for the Form */}
        <div className="my-16 border-t border-gray-200 pt-12 text-center">
           <h2 className="mb-4 text-3xl font-bold text-gray-800">
            Submit Your Application
          </h2>
           <p className="text-lg text-gray-600">
             Select the position you're interested in and fill out the details.
           </p>
        </div>

        {/* Render the Job Application Form */}
        <JobApplicationForm /> 
      </div>
    </div>
  );
}