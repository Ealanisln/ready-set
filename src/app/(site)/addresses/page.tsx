"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import UserAddresses from "@/components/AddressManager/UserAddresses";
import { createClient } from "@/utils/supabase/client";

const AddressesPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      (_event, session) => {
        setSession(session);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login?redirect=/addresses");
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
    <section id="catering-request" className="bg-gray-1 pb-8 dark:bg-dark-2">
      <div className="container">
        <div className="mb-[60px]">
          <Breadcrumb pageName="Addresses manager" />
          <UserAddresses />
        </div>
      </div>
    </section>
  );
};

export default AddressesPage;