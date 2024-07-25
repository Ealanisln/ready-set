import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

export async function GET(request: NextRequest) {
  console.log('API route hit:', request.method, request.url);

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
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