"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthDebugEnhanced() {
  const { data: session, status } = useSession();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [envCheck, setEnvCheck] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check CSRF token
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((err) => {
        console.error("CSRF fetch error:", err);
        setError(`CSRF Error: ${err.message}`);
      });

    // Check environment variables
    fetch("/api/check-auth-env")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Environment check response:", data);
        setEnvCheck(data);
      })
      .catch((err) => {
        console.error("Environment check error:", err);
        setError(`Env Check Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="m-4 rounded bg-gray-100 p-4">
      <h2 className="mb-2 text-lg font-bold">Auth Debug Information</h2>
      <div className="space-y-2">
        <p>
          <strong>Auth Status:</strong> {status}
        </p>
        <p>
          <strong>CSRF Token Present:</strong> {csrfToken ? "Yes" : "No"}
        </p>
        {error && (
          <p className="text-red-500">
            <strong>Error:</strong> {error}
          </p>
        )}
        <p>
          <strong>Session Data:</strong>
        </p>
        <pre className="rounded bg-white p-2">
          {JSON.stringify(session, null, 2)}
        </pre>
        <div>
          <p>
            <strong>Environment Checks:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>NEXTAUTH_SECRET: {envCheck.has_secret ? "✅" : "❌"}</li>
            <li>NEXTAUTH_URL: {envCheck.nextauth_url ? "✅" : "❌"}</li>
            <li>DATABASE_URL: {envCheck.database_url ? "✅" : "❌"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
