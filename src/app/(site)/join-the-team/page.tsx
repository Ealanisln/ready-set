// app/join-team/page.tsx
import type { Metadata } from "next";
import JoinOurTeam from "@/components/JoinTheTeam/index";

export const metadata: Metadata = {
  title: "Join Our Team | Career Opportunities at Ready Set Group LLC",
  description: "Join the Bay Area's premier catering delivery and virtual assistant service provider. Explore exciting opportunities in logistics, VA services, and more. Flexible positions available.",
  keywords: [
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
    title: "Join Our Team | Ready Set Group LLC Careers",
    description: "Build your career with the Bay Area's leading business solutions provider. Competitive positions in logistics and virtual assistance available.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Opportunities | Ready Set Group LLC",
    description: "Join our growing team of logistics and virtual assistant professionals. Flexible positions and competitive benefits available.",
  },
};

export default function JoinTheTeamPage() {
  return (
    <>
      <JoinOurTeam />
    </>
  );
}