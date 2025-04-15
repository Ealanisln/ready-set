"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { Loader2, ChevronDown } from "lucide-react";
import SectionTitle from "@/components/Common/SectionTitle";
import Faq from "@/components/Faq";
import OnDemandOrderForm from "@/components/CateringRequest/OnDemandForm";
import { createClient } from "@/utils/supabase/client";

// Checklist Component
const DeliveryChecklist = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checklistItems = [
    "Verify pickup location and delivery address details",
    "Confirm headcount and order total accuracy",
    "Double-check order number from brokerage service",
    "Verify pickup and delivery time windows",
    "Check if a host is needed and for how long",
    "Note any special delivery or setup instructions",
    "Confirm payment details are accurate",
    "Include any necessary dietary restrictions or allergen information"
  ];

  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <div 
        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">8-Point Delivery Checklist</h3>
        <ChevronDown className={`h-5 w-5 transform text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {checklistItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                  {index + 1}
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const OnDemandPage = () => {
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
      router.push("/login?redirect=/on-demand");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section
      id="on-demand-request"
      className="bg-gray-50 pb-16 pt-24 dark:bg-gray-900 lg:pb-24 lg:pt-28"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionTitle
            title="On-Demand Request"
            subtitle="Professional Delivery"
            paragraph="Complete the form below to request on-demand delivery services. We follow our 8-point checklist to ensure flawless delivery and setup."
            center
          />
        </div>
        
        <DeliveryChecklist />
        
        <div className="mx-auto">
          <OnDemandOrderForm />
        </div>
        
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h2>
          <Faq />
        </div>
      </div>
    </section>
  );
};

export default OnDemandPage;