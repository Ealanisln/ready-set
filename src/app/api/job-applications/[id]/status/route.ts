import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { JobApplicationError, trackJobApplicationError } from '@/utils/domain-error-tracking';

// Status update validation schema
const statusUpdateSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'BACKGROUND_CHECK',
    'REJECTED',
    'OFFER_EXTENDED',
    'OFFER_ACCEPTED',
    'ONBOARDING',
    'CONVERT_TO_DRIVER',
    'WITHDRAWN'
  ]),
  notes: z.string().optional(),
  interviewDate: z.string().datetime().optional(),
  rejectionReason: z.string().optional(),
  offerDetails: z.object({
    position: z.string(),
    compensation: z.string(),
    startDate: z.string().datetime(),
    additionalNotes: z.string().optional()
  }).optional(),
  updatedBy: z.string().uuid() // Admin/Reviewer ID who updated the status
});

type StatusUpdateRequest = z.infer<typeof statusUpdateSchema>;

/**
 * Mock function to validate application access permission
 */
async function validateUpdatePermission(
  applicationId: string, 
  updaterId: string
): Promise<boolean> {
  // Simulate permission check
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For testing, any updaterId starting with "unauthorized" will be rejected
  return !updaterId.startsWith('unauthorized');
}

/**
 * Mock function to get application current data
 */
async function getApplicationData(
  applicationId: string
): Promise<{
  userId: string;
  status: string;
  position: string;
  location: string;
  documents: string[];
} | null> {
  // Simulate database lookup
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For testing, applications with IDs starting with "not-found" will return null
  if (applicationId.startsWith('not-found')) {
    return null;
  }
  
  // Mock data
  return {
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    status: ['SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED'][Math.floor(Math.random() * 3)],
    position: 'Delivery Driver',
    location: 'San Francisco, CA',
    documents: [`doc_${Math.floor(Math.random() * 100)}`, `doc_${Math.floor(Math.random() * 100)}`]
  };
}

/**
 * Mock function to update application status
 */
async function updateApplicationStatus(
  applicationId: string,
  status: StatusUpdateRequest
): Promise<{ success: boolean; error?: string }> {
  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simulate random database errors (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Database error while updating application status'
    };
  }
  
  return { success: true };
}

/**
 * Mock function to convert application to driver account
 */
async function convertToDriverAccount(
  applicationId: string,
  userId: string,
  position: string,
  documents: string[]
): Promise<{ success: boolean; driverId?: string; error?: string }> {
  // Simulate complex conversion process
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate potential conversion errors (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: 'Failed to create driver account'
    };
  }
  
  // Generate mock driver ID
  const driverId = `driver_${Math.floor(Math.random() * 10000)}`;
  
  return {
    success: true,
    driverId
  };
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const applicationId = params.id;
    
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const updateResult = statusUpdateSchema.safeParse(body);
    
    if (!updateResult.success) {
      // Extract validation errors from Zod
      const validationErrors = updateResult.error.format();
      
      // Create error with context for tracking
      const error = new JobApplicationError(
        'Status update validation failed',
        'STATUS_UPDATE_ERROR',
        {
          applicationId,
          validationErrors,
          attemptedAction: 'update_status'
        }
      );
      
      // Track the error with Highlight.io
      trackJobApplicationError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Status update validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const updateData = updateResult.data;
    
    // Get current application data
    const applicationData = await getApplicationData(applicationId);
    
    if (!applicationData) {
      const error = new JobApplicationError(
        'Application not found',
        'STATUS_UPDATE_ERROR',
        {
          applicationId,
          attemptedAction: 'update_status'
        }
      );
      
      trackJobApplicationError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Application not found'
      }, { status: 404 });
    }
    
    // Validate permission to update
    try {
      const hasPermission = await validateUpdatePermission(
        applicationId,
        updateData.updatedBy
      );
      
      if (!hasPermission) {
        const error = new JobApplicationError(
          'Unauthorized to update application status',
          'STATUS_UPDATE_ERROR',
          {
            applicationId,
            userId: applicationData.userId,
            attemptedAction: 'update_status'
          }
        );
        
        trackJobApplicationError(error, error.type, error.context);
        
        return NextResponse.json({
          error: 'Not authorized to update this application status'
        }, { status: 403 });
      }
    } catch (error) {
      const permissionError = new JobApplicationError(
        'Failed to validate update permission',
        'STATUS_UPDATE_ERROR',
        {
          applicationId,
          userId: applicationData.userId,
          attemptedAction: 'validate_permission'
        }
      );
      
      trackJobApplicationError(permissionError, permissionError.type, permissionError.context);
      
      return NextResponse.json({
        error: 'Failed to validate update permission'
      }, { status: 500 });
    }
    
    // Ensure required fields for specific statuses
    if (updateData.status === 'REJECTED' && !updateData.rejectionReason) {
      const error = new JobApplicationError(
        'Rejection reason is required when status is REJECTED',
        'FORM_VALIDATION_ERROR',
        {
          applicationId,
          userId: applicationData.userId,
          status: updateData.status,
          validationErrors: {
            rejectionReason: ['This field is required when status is REJECTED']
          }
        }
      );
      
      trackJobApplicationError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Rejection reason is required when status is REJECTED',
        field: 'rejectionReason'
      }, { status: 400 });
    }
    
    if (updateData.status === 'INTERVIEW_SCHEDULED' && !updateData.interviewDate) {
      const error = new JobApplicationError(
        'Interview date is required when status is INTERVIEW_SCHEDULED',
        'FORM_VALIDATION_ERROR',
        {
          applicationId,
          userId: applicationData.userId,
          status: updateData.status,
          validationErrors: {
            interviewDate: ['This field is required when status is INTERVIEW_SCHEDULED']
          }
        }
      );
      
      trackJobApplicationError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Interview date is required when status is INTERVIEW_SCHEDULED',
        field: 'interviewDate'
      }, { status: 400 });
    }
    
    if (updateData.status === 'OFFER_EXTENDED' && !updateData.offerDetails) {
      const error = new JobApplicationError(
        'Offer details are required when status is OFFER_EXTENDED',
        'FORM_VALIDATION_ERROR',
        {
          applicationId,
          userId: applicationData.userId,
          status: updateData.status,
          validationErrors: {
            offerDetails: ['This field is required when status is OFFER_EXTENDED']
          }
        }
      );
      
      trackJobApplicationError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Offer details are required when status is OFFER_EXTENDED',
        field: 'offerDetails'
      }, { status: 400 });
    }
    
    // Update the application status
    try {
      const updateResult = await updateApplicationStatus(applicationId, updateData);
      
      if (!updateResult.success) {
        const error = new JobApplicationError(
          updateResult.error || 'Failed to update application status',
          'STATUS_UPDATE_ERROR',
          {
            applicationId,
            userId: applicationData.userId,
            status: updateData.status,
            attemptedAction: 'update_status'
          }
        );
        
        trackJobApplicationError(error, error.type, error.context);
        
        return NextResponse.json({
          error: updateResult.error || 'Failed to update application status'
        }, { status: 500 });
      }
    } catch (error) {
      const updateError = new JobApplicationError(
        error instanceof Error ? error.message : 'Error updating application status',
        'STATUS_UPDATE_ERROR',
        {
          applicationId,
          userId: applicationData.userId,
          status: updateData.status,
          attemptedAction: 'update_status'
        }
      );
      
      trackJobApplicationError(updateError, updateError.type, updateError.context);
      
      return NextResponse.json({
        error: 'Failed to update application status due to a system error'
      }, { status: 500 });
    }
    
    // Handle additional logic for specific status changes
    if (updateData.status === 'CONVERT_TO_DRIVER') {
      try {
        const conversionResult = await convertToDriverAccount(
          applicationId,
          applicationData.userId,
          applicationData.position,
          applicationData.documents
        );
        
        if (!conversionResult.success) {
          const error = new JobApplicationError(
            conversionResult.error || 'Failed to convert applicant to driver',
            'CONVERT_TO_DRIVER_ERROR',
            {
              applicationId,
              userId: applicationData.userId,
              documentIds: applicationData.documents,
              jobPosition: applicationData.position,
              location: applicationData.location
            }
          );
          
          trackJobApplicationError(error, error.type, error.context);
          
          return NextResponse.json({
            error: conversionResult.error || 'Failed to convert applicant to driver',
            statusUpdated: true
          }, { status: 500 });
        }
        
        // Return successful response with driver ID
        return NextResponse.json({
          success: true,
          applicationId,
          status: updateData.status,
          driverId: conversionResult.driverId,
          message: 'Application status updated and driver account created'
        });
      } catch (error) {
        const conversionError = new JobApplicationError(
          error instanceof Error ? error.message : 'Error during driver conversion',
          'CONVERT_TO_DRIVER_ERROR',
          {
            applicationId,
            userId: applicationData.userId,
            documentIds: applicationData.documents,
            jobPosition: applicationData.position,
            location: applicationData.location
          }
        );
        
        trackJobApplicationError(conversionError, conversionError.type, conversionError.context);
        
        return NextResponse.json({
          error: 'Failed to complete driver conversion process',
          statusUpdated: true
        }, { status: 500 });
      }
    }
    
    // Return success response for standard status updates
    return NextResponse.json({
      success: true,
      applicationId,
      status: updateData.status,
      message: 'Application status updated successfully'
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in job application status update:', error);
    
    const applicationId = 'unknown';
    
    const unexpectedError = new JobApplicationError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'STATUS_UPDATE_ERROR',
      {
        applicationId,
        attemptedAction: 'update_status'
      }
    );
    
    trackJobApplicationError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred while updating the application status'
    }, { status: 500 });
  }
} 