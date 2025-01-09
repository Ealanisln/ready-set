// src/app/api/form-submissions/route.ts

import { NextResponse } from 'next/server';
import { FormSubmissionService } from '@/lib/form-submissions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.formType) {
      return NextResponse.json(
        { error: 'Form type is required' },
        { status: 400 }
      );
    }

    if (!body.formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      );
    }

    // Validate form type
    const validFormTypes = ['food', 'flower', 'bakery', 'specialty'];
    if (!validFormTypes.includes(body.formType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      );
    }

    // Log incoming request
    console.log('Received form submission:', {
      formType: body.formType,
      formData: body.formData,
    });
    
    const submission = await FormSubmissionService.createSubmission({
      formType: body.formType,
      formData: body.formData,
    });

    // Log successful submission
    console.log('Form submission successful:', {
      id: submission.id,
      formType: submission.formType,
    });

    return NextResponse.json({ 
      success: true, 
      data: submission 
    });
  } catch (error) {
    console.error('Error in form submission endpoint:', error);
    
    // Return more specific error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}