// src/app/api/form-submissions/route.ts

import { NextResponse } from 'next/server';
import { FormSubmissionService } from '@/lib/form-submissions';
import { EmailService } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Add validation for nested fields
    if (!body.formData?.companyName?.trim()) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!body.formData?.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // More specific form type validation
    const validFormTypes = ['food', 'flower', 'bakery', 'specialty'];
    const formType = body.formType?.toLowerCase();
    if (!formType || !validFormTypes.includes(formType)) {
      return NextResponse.json(
        { error: `Invalid form type. Valid types are: ${validFormTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!body.formData?.pickupAddress?.street?.trim()) {
      return NextResponse.json(
        { error: 'Street address is required' },
        { status: 400 }
      );
    }
    
    if (!body.formData?.counties?.length) {
      return NextResponse.json(
        { error: 'At least one county must be selected' },
        { status: 400 }
      );
    }

    console.log('Attempting to create submission...');
    const submission = await FormSubmissionService.createSubmission({
      formType,
      formData: body.formData,
    });

    console.log(`Submission created with ID: ${submission.id}`);
    
    try {
      console.log('Attempting to send notification email...');
      await EmailService.sendFormSubmissionNotification({
        formType,
        formData: body.formData,
        submissionId: submission.id
      });
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({ 
      success: true, 
      data: submission 
    });

  } catch (error) {
    console.error('Detailed submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}