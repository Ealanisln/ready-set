"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SectionTitle from "@/components/Common/SectionTitle";
import Faq from "@/components/Faq";
import OnDemandOrderForm from "@/components/CateringRequest/OnDemandForm";
import { createClient } from "@/utils/supabase/client";

const OnDemandPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push("/sign-in");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/sign-in");
        } else if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        }
      }
    );

    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!user) {
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
            title={"Catering Request"}
            subtitle={"8-point Checklist"}
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