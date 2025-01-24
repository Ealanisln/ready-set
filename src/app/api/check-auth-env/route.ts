// app/api/check-auth-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    has_secret: !!process.env.NEXTAUTH_SECRET,
    nextauth_url: !!process.env.NEXTAUTH_URL,
    database_url: !!process.env.DATABASE_URL
  });
}