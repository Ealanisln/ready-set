import { NextResponse } from 'next/server';
import { FormSubmissionService } from '@/lib/form-submissions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Optional: Add validation here
    
    const submission = await FormSubmissionService.createSubmission({
      formType: body.formType,
      formData: body.formData,
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error in form submission endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}