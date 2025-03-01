import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const allowedCounties = await fetchAllowedCountiesForUser(userId);
    return NextResponse.json({ counties: allowedCounties });
  } catch (error) {
    console.error('Error fetching allowed counties:', error);
    return NextResponse.json({ error: 'Failed to fetch allowed counties' }, { status: 500 });
  }
}

async function fetchAllowedCountiesForUser(userId: string): Promise<string[]> {
  return ['San Mateo', 'Contra Costa', 'Alameda'];
}