// Add this to a component that loads after login
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function DebugUserRole() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Create the browser client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function checkUser() {
      try {
        // Get authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // If user exists, get their profile
        let profile = null;
        let profileError = null;
        if (user) {
          console.log("Found user:", user.id);
          // Try first with auth_user_id
          let { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_user_id", user.id)
            .single();

          if (error) {
            console.log("First query failed, trying with id field");
            // Try with id field as fallback
            const result = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();
            
            data = result.data;
            error = result.error;
          }

          profile = data;
          profileError = error;
        }

        setDebugInfo({ user, profile, profileError });
        console.log("Debug Info:", { user, profile, profileError });
      } catch (error) {
        console.error("Error in debug component:", error);
        setDebugInfo({ error: String(error) });
      }
    }

    checkUser();
  }, [supabase]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        zIndex: 9999,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        padding: "10px",
        maxWidth: "400px",
        maxHeight: "300px",
        overflow: "auto",
      }}
    >
      <h3>Auth Debug</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}