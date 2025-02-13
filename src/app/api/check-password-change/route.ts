import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Assuming you store temporary password status in user metadata or a profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_temporary_password")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    needsPasswordChange: profile?.is_temporary_password ?? false,
  });
}
