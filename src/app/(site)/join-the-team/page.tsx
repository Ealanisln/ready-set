// app/join-team/page.tsx
import type { Metadata } from "next";
import JoinOurTeam from "@/components/JoinTheTeam/index";

export const metadata: Metadata = {
  title: "Join Our Team | Ready Set",
  description: "Join our amazing team at Ready Set. We're always looking for great talent to help us grow and deliver exceptional experiences.",
  openGraph: {
    title: "Join Our Team | Ready Set",
    description: "Join our amazing team at Ready Set. We're always looking for great talent to help us grow and deliver exceptional experiences.",
    url: "https://ready-set.co/join-team",
    siteName: "Ready Set",
    locale: "en_US",
    type: "website",
  },
};

export default function JoinTheTeamPage() {
  return (
    <>
      <JoinOurTeam />
    </>
  );
}