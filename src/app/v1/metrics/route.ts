import { NextResponse } from 'next/server';
import { withAppRouterHighlight } from '@/utils/app-router-highlight.config';

// Handler for Highlight metrics
const handler = async (request: Request) => {
  try {
    // This route is used by Highlight.run to collect metrics
    // Simply acknowledge the request
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in metrics endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
};

// Set the runtime to nodejs for Highlight tracking
export const runtime = 'nodejs';

// Export both GET and POST methods with Highlight wrapped handlers
export const GET = withAppRouterHighlight(handler);
export const POST = withAppRouterHighlight(handler); 