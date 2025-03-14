"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import Faq from "@/components/Faq";
import SectionTitle from "@/components/Common/SectionTitle";
import CateringRequestForm from "@/components/CateringRequest/CateringRequestForm";
import { createClient } from "@/utils/supabase/client";

const CateringPage = () => {
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabase(client);
    };
    
    initSupabase();
  }, []);

  useEffect(() => {
    // Skip if Supabase client is not yet initialized
    if (!supabase) return;
    
    // Fetch the session when the component mounts
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]); // Depend on supabase client

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login?redirect=/catering");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
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
            title={"Catering Request"}
            subtitle={"8-point Checklist"}
            paragraph="We follow an 8-point checklist to minimize errors and ensure an on-time delivery set up."
            center
          />
        </div>
        <div className="flex flex-col items-center space-y-8">
          {/* You can choose to use either CateringOrderForm or CateringRequestForm here */}
          {/* <CateringOrderForm /> */}
          <CateringRequestForm />
          <Faq />
        </div>
      </div>
    </section>
  );
};

export default CateringPage;