// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import sendEmail from '@/app/actions/email';

export async function POST() {
    try {
      const result = await sendEmail({
        name: 'Test User',
        email: 'info@ready-set.co',
        message: 'Test message',
        phone: '1234567890' // Optional
      });
      
      return NextResponse.json({ success: true, message: result });
    } catch (error) {
      console.error('Email test error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  }