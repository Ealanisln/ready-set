// src/app/(backend)/admin/users/[id]/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import ModernUserProfile from "@/components/Dashboard/UserView/ModernUserProfile";

export default function EditUser() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { session, isLoading: isUserLoading } = useUser();

  // Check auth status and redirect if needed
  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push('/sign-in');
    }
  }, [session, isUserLoading, router]);

  // Get the ID using useParams instead of the params prop
  const userId = params.id;

  // Simple wrapper that passes the user ID to the component
  return <ModernUserProfile userId={userId} />;
}