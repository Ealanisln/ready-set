'use server'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

// Define correct interface for page props
interface Props {
  params: { [key: string]: string };
  searchParams: { error?: string };
}

export default async function HighlightSsrTestPage(props: { 
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const searchParams = await props.searchParams;
  
  // Throw an error if the error query parameter is present
  if (typeof searchParams.error !== "undefined") {
    console.error("Throwing intentional SSR error for Highlight testing")
    throw new Error('Intentional SSR Error with use-server directive: highlight-ssr-test/page.tsx')
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Highlight SSR Error Test Page</h1>
        
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <p className="mb-4">This page is currently working normally. Add <code>?error</code> to the URL to trigger an SSR error.</p>
          <div className="flex items-center gap-4">
            <Link href="/highlight-ssr-test?error" passHref>
              <Button variant="destructive">
                Trigger SSR Error
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Random value: {Math.random().toFixed(6)}
            </p>
            <p className="text-sm text-gray-500">
              Time: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Testing Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the "Trigger SSR Error" button to generate a server-side error</li>
            <li>Verify that the custom error page appears with the error message</li>
            <li>Check Highlight dashboard to confirm the error was captured</li>
            <li>Use the "Try again" button on the error page to return here</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 