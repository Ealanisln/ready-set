import { NextResponse } from "next/server";
import { AppRouterHighlight } from '@highlight-run/next/server';
import { CONSTANTS } from '@/constants';

// Configure Highlight wrapper
const withAppRouterHighlight = AppRouterHighlight({
  projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
});

// Server-side test endpoint for validating Highlight integration
export const GET = withAppRouterHighlight(async function GET(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  const url = new URL(request.url);
  const shouldError = url.searchParams.has('error');
  
  try {
    // If error param is present, throw an error to test error tracking
    if (shouldError) {
      console.error("Intentionally throwing test error");
      throw new Error('Test server error from /api/users/highlight-test');
    }
    
    // Normal path
    return NextResponse.json({ 
      message: "Highlight test endpoint functioning normally",
      timestamp: new Date().toISOString(),
      path: "/api/users/highlight-test"
    });
  } catch (error) {
    // Log and report error
    console.error("Test error thrown:", error);
    
    return NextResponse.json(
      { 
        error: "Test error triggered",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
});

// Set the runtime to nodejs since we're using Highlight
export const runtime = 'nodejs'; 