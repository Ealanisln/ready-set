import { redirect } from "next/navigation";
import { validateAdminRole } from "@/middleware/authMiddleware";
import UsersClient from "./UsersClient";
import { createClient } from "@/utils/supabase/server";

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

  return <UsersClient />;
}