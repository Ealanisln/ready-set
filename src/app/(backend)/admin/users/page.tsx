import { redirect } from "next/navigation";
import { validateAdminRole } from "@/middleware/authMiddleware";
import UsersClient from "./UsersClient";
import { createClient } from "@/utils/supabase/server";
import AdminHighlightInit from "@/app/admin-highlight-init";
import { HighlightErrorBoundary } from '@/components/ErrorBoundary/HighlightErrorBoundary';
import Link from "next/link";

// Server component for authentication and protection
export default async function UsersPage() {
  // Server-side authentication check to prevent unauthorized access
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    redirect("/sign-in?returnTo=/admin/users");
  }

  // Check user role to ensure they have admin privileges
  const { data: profile } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin", "helpdesk"].includes(profile.type.toLowerCase())) {
    // Redirect to appropriate page if not an admin or helpdesk
    redirect("/");
  }

  return (
    <>
      <AdminHighlightInit />
      <div className="p-2 bg-amber-50 border-b border-amber-200 text-sm">
        <p className="text-amber-800">
          Having issues with error tracking? Try our{" "}
          <Link href="/highlight-test" className="underline font-medium">
            Highlight Test Page
          </Link>
        </p>
      </div>
      <HighlightErrorBoundary>
        <UsersClient />
      </HighlightErrorBoundary>
    </>
  );
}