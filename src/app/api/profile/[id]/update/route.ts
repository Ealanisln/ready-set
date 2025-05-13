import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ProfileManagementError, trackProfileError } from '@/utils/domain-error-tracking';

// Profile update validation schema
const profileUpdateSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, {
    message: "Phone number must be between 10-15 digits, may start with '+'"
  }).optional(),
  jobTitle: z.string().max(100).optional(),
  companyId: z.string().uuid().optional(),
  companyName: z.string().max(100).optional(),
  profileImageId: z.string().optional(),
  bio: z.string().max(500).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  roleIds: z.array(z.string()).optional(),
});

type ProfileUpdateRequest = z.infer<typeof profileUpdateSchema>;

/**
 * Mock function to check if email is already in use
 */
async function isEmailInUse(email: string, userId: string): Promise<boolean> {
  // Simulate database check
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For testing purposes, consider emails containing "taken" as already in use
  return email.toLowerCase().includes('taken') && !email.toLowerCase().includes(userId);
}

/**
 * Mock function to validate company access
 */
async function validateCompanyAccess(
  userId: string, 
  companyId: string
): Promise<{ valid: boolean; reason?: string }> {
  // Simulate permission check
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For testing, consider some company IDs as restricted
  if (companyId.startsWith('restricted')) {
    return {
      valid: false,
      reason: 'User does not have permission to associate with this company'
    };
  }
  
  return { valid: true };
}

/**
 * Mock function to update user profile in database
 */
async function updateUserProfile(
  userId: string,
  data: ProfileUpdateRequest
): Promise<{ success: boolean; updatedUser?: Record<string, any>; error?: string }> {
  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simulate random database errors (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Database connection error'
    };
  }
  
  // Mock successful update
  return {
    success: true,
    updatedUser: {
      id: userId,
      ...data,
      updatedAt: new Date().toISOString()
    }
  };
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const userId = params.id;
    
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const updateResult = profileUpdateSchema.safeParse(body);
    
    if (!updateResult.success) {
      // Extract validation errors from Zod
      const validationErrors = updateResult.error.format();
      
      // Create error with context for tracking
      const error = new ProfileManagementError(
        'Profile update validation failed',
        'PROFILE_UPDATE_FAILED',
        {
          userId,
          attemptedAction: 'update_profile',
          validationErrors
        }
      );
      
      // Track the error with Highlight.io
      trackProfileError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Profile update validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const updateData = updateResult.data;
    
    // If email is being updated, check if it's already in use
    if (updateData.email) {
      try {
        const emailInUse = await isEmailInUse(updateData.email, userId);
        
        if (emailInUse) {
          const error = new ProfileManagementError(
            'Email is already in use',
            'EMAIL_UPDATE_VALIDATION_ERROR',
            {
              userId,
              email: updateData.email,
              attemptedAction: 'update_email'
            }
          );
          
          trackProfileError(error, error.type, error.context);
          
          return NextResponse.json({
            error: 'Email is already in use',
            field: 'email'
          }, { status: 400 });
        }
      } catch (error) {
        const validationError = new ProfileManagementError(
          'Failed to validate email uniqueness',
          'EMAIL_UPDATE_VALIDATION_ERROR',
          {
            userId,
            email: updateData.email,
            attemptedAction: 'validate_email'
          }
        );
        
        trackProfileError(validationError, validationError.type, validationError.context);
        
        return NextResponse.json({
          error: 'Failed to validate email uniqueness',
          field: 'email'
        }, { status: 500 });
      }
    }
    
    // If company ID is being updated, validate access
    if (updateData.companyId) {
      try {
        const companyAccessResult = await validateCompanyAccess(userId, updateData.companyId);
        
        if (!companyAccessResult.valid) {
          const error = new ProfileManagementError(
            companyAccessResult.reason || 'Cannot associate with this company',
            'COMPANY_INFO_UPDATE_ERROR',
            {
              userId,
              companyId: updateData.companyId,
              attemptedAction: 'update_company'
            }
          );
          
          trackProfileError(error, error.type, error.context);
          
          return NextResponse.json({
            error: companyAccessResult.reason || 'Cannot associate with this company',
            field: 'companyId'
          }, { status: 403 });
        }
      } catch (error) {
        const companyError = new ProfileManagementError(
          'Failed to validate company access',
          'COMPANY_INFO_UPDATE_ERROR',
          {
            userId,
            companyId: updateData.companyId,
            attemptedAction: 'validate_company_access'
          }
        );
        
        trackProfileError(companyError, companyError.type, companyError.context);
        
        return NextResponse.json({
          error: 'Failed to validate company access',
          field: 'companyId'
        }, { status: 500 });
      }
    }
    
    // Validate profile image if provided
    if (updateData.profileImageId) {
      // This would typically validate the image exists and is accessible to the user
      // For this example, we'll just check if it contains a specific string
      if (updateData.profileImageId.includes('invalid')) {
        const error = new ProfileManagementError(
          'Invalid profile image',
          'PROFILE_IMAGE_UPLOAD_ERROR',
          {
            userId,
            imageId: updateData.profileImageId,
            attemptedAction: 'update_profile_image'
          }
        );
        
        trackProfileError(error, error.type, error.context);
        
        return NextResponse.json({
          error: 'The specified profile image does not exist or is not accessible',
          field: 'profileImageId'
        }, { status: 400 });
      }
    }
    
    // Update the profile
    try {
      const updateResult = await updateUserProfile(userId, updateData);
      
      if (!updateResult.success) {
        const error = new ProfileManagementError(
          updateResult.error || 'Failed to update profile',
          'PROFILE_UPDATE_FAILED',
          {
            userId,
            attemptedAction: 'save_profile_changes'
          }
        );
        
        trackProfileError(error, error.type, error.context);
        
        return NextResponse.json({
          error: updateResult.error || 'Failed to update profile'
        }, { status: 500 });
      }
      
      // Return success response
      return NextResponse.json({
        success: true,
        profile: updateResult.updatedUser
      });
      
    } catch (error) {
      const updateError = new ProfileManagementError(
        error instanceof Error ? error.message : 'Unknown error updating profile',
        'PROFILE_UPDATE_FAILED',
        {
          userId,
          attemptedAction: 'save_profile_changes'
        }
      );
      
      trackProfileError(updateError, updateError.type, updateError.context);
      
      return NextResponse.json({
        error: 'Failed to update profile due to a system error'
      }, { status: 500 });
    }
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in profile update:', error);
    
    const userId = 'unknown';
    
    const unexpectedError = new ProfileManagementError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'PROFILE_UPDATE_FAILED',
      {
        userId,
        attemptedAction: 'update_profile'
      }
    );
    
    trackProfileError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred while updating your profile'
    }, { status: 500 });
  }
} 