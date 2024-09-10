"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SectionTitle from "@/components/Common/SectionTitle";
import Faq from "@/components/Faq";
import OnDemandOrderForm from "@/components/CateringRequest/OnDemandForm";

const OnDemandPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section
      id="catering-request"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="8-Point Checklist"
            title="On-Demand request"
            paragraph="We follow an 8-point checklist to minimize errors and ensure an on-time delivery set up."
            center
          />
        </div>
        <div className="flex flex-col items-center space-y-8">
          <OnDemandOrderForm />
          <Faq />
        </div>
      </div>
    </section>
  );
};

export default OnDemandPage;
