"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AddressManager from "@/components/AddressManager";
import Breadcrumb from "@/components/Common/Breadcrumb";

const AddressesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  console.log(session);

  return (
    <main>
      <Breadcrumb pageName="Addresses page" />
    </main>
  );
};

export default AddressesPage;