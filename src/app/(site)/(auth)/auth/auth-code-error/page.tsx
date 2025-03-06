// app/auth/auth-code-error/page.tsx
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-8 sm:px-20 text-center">
        <h1 className="text-3xl font-bold mb-6">Authentication Error</h1>
        <p className="mb-6">
          There was an error processing your authentication request.
        </p>
        <p className="mb-8">
          This could be due to an expired or invalid authentication code.
        </p>
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Login
        </Link>
      </main>
    </div>
  );
}