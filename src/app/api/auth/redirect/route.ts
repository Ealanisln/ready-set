import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const destination = searchParams.get('destination');

  if (!destination) {
    return NextResponse.json({ error: 'Invalid destination' }, { status: 400 });
  }

  // Validate the destination URL contains one of your known domains
  // IMPORTANT: This currently checks if the *destination* (Supabase callback)
  // contains one of these domains. This might not be what you intend.
  // Typically, you'd validate the origin of the request or ensure the
  // destination is *exactly* the Supabase callback or another allowed URL.
  const allowedDomains = [
    'ready-sets-projects.vercel.app', // Your frontend domain
    'localhost:3000',             // Your local dev domain
    'supabase.co'                 // Domain for Supabase callback
    // Add other valid domains/origins if necessary
  ];

  let isAllowed = false;
  try {
    const destinationUrl = new URL(destination);
    // Check if the destination *hostname* is exactly the Supabase callback hostname or ends with an allowed domain suffix.
    // A more secure check might involve comparing against the full expected Supabase URL.
    isAllowed = allowedDomains.some(domain => destinationUrl.hostname.endsWith(domain));
    
    // A stricter check might be:
    // const expectedSupabaseCallback = 'https://jiasmmmmhtreoacdpiby.supabase.co/auth/v1/callback';
    // isAllowed = destination === expectedSupabaseCallback;

  } catch (error) {
    // Invalid URL format
    return NextResponse.json({ error: 'Invalid destination URL format' }, { status: 400 });
  }

  if (!isAllowed) {
    console.error(`Unauthorized redirect attempt to: ${destination}`);
    return NextResponse.json({ error: 'Unauthorized redirect destination' }, { status: 403 });
  }

  // Perform the redirect using NextResponse
  return NextResponse.redirect(destination, 302);
} 