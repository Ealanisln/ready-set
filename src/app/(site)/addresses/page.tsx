"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import UserAddresses from "@/components/AddressManager/UserAddresses";

const AddressesPage = () => {
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
