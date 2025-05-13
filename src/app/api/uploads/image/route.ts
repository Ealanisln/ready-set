import { NextRequest, NextResponse } from 'next/server';
import { FileUploadError, FileUploadErrorType, trackFileUploadError } from '@/utils/domain-error-tracking';

// Constants for file upload restrictions
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Interface for file validation result
interface FileValidationResult {
  valid: boolean;
  error?: {
    type: FileUploadErrorType;
    message: string;
  };
}

/**
 * Validates uploaded file against size and type restrictions
 */
function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: {
        type: 'UPLOAD_SIZE_LIMIT_EXCEEDED',
        message: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      }
    };
  }
  
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: {
        type: 'INVALID_FILE_FORMAT',
        message: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
      }
    };
  }
  
  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: {
        type: 'INVALID_FILE_FORMAT',
        message: `File extension is not allowed. Allowed extensions: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
      }
    };
  }
  
  return { valid: true };
}

/**
 * Mock function to simulate uploading a file to storage
 */
async function uploadFileToStorage(
  file: File, 
  userId: string, 
  entityType?: string, 
  entityId?: string
): Promise<{ fileId: string; url: string; } | null> {
  try {
    // Simulate upload process with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate random storage errors (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Storage service unavailable');
    }
    
    // Generate mock file ID and URL
    const fileId = `file_${Math.random().toString(36).substring(2, 15)}`;
    const url = `https://storage.example.com/uploads/${userId}/${fileId}/${file.name}`;
    
    return { fileId, url };
  } catch (error) {
    console.error('Error uploading to storage:', error);
    throw error;
  }
}

/**
 * Mock function to associate file with an entity in database
 */
async function associateFileWithEntity(
  fileId: string,
  entityType: string,
  entityId: string,
  userId: string
): Promise<boolean> {
  try {
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate random database errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Database error: could not associate file with entity');
    }
    
    return true;
  } catch (error) {
    console.error('Error associating file with entity:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      const error = new FileUploadError(
        'Invalid content type. Must be multipart/form-data',
        'INVALID_FILE_FORMAT',
        {
          errorDetails: {
            code: 'INVALID_CONTENT_TYPE',
            message: 'Request must be multipart/form-data'
          }
        }
      );
      
      trackFileUploadError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Invalid content type. Must be multipart/form-data'
      }, { status: 400 });
    }
    
    // Get form data
    const formData = await req.formData();
    
    // Get file from form data
    const file = formData.get('file') as File;
    if (!file) {
      const error = new FileUploadError(
        'No file provided',
        'INVALID_FILE_FORMAT',
        {
          errorDetails: {
            code: 'FILE_MISSING',
            message: 'No file was provided in the request'
          }
        }
      );
      
      trackFileUploadError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'No file provided'
      }, { status: 400 });
    }
    
    // Get additional metadata
    const userId = formData.get('userId') as string;
    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;
    
    // Validate required fields
    if (!userId) {
      const error = new FileUploadError(
        'User ID is required',
        'ENTITY_ASSOCIATION_ERROR',
        {
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          errorDetails: {
            code: 'USER_ID_MISSING',
            message: 'User ID is required for file uploads'
          }
        }
      );
      
      trackFileUploadError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    // If entityType is provided, entityId must also be provided
    if (entityType && !entityId) {
      const error = new FileUploadError(
        'Entity ID is required when entity type is provided',
        'ENTITY_ASSOCIATION_ERROR',
        {
          userId,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          entityType,
          errorDetails: {
            code: 'ENTITY_ID_MISSING',
            message: 'Entity ID is required when entity type is provided'
          }
        }
      );
      
      trackFileUploadError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Entity ID is required when entity type is provided'
      }, { status: 400 });
    }
    
    // Validate file
    const validationResult = validateFile(file);
    if (!validationResult.valid) {
      const error = new FileUploadError(
        validationResult.error!.message,
        validationResult.error!.type,
        {
          userId,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          entityType,
          entityId,
          errorDetails: {
            code: validationResult.error!.type,
            message: validationResult.error!.message
          }
        }
      );
      
      trackFileUploadError(error, error.type, error.context);
      
      return NextResponse.json({
        error: validationResult.error!.message
      }, { status: 400 });
    }
    
    // Attempt to upload the file
    let uploadResult;
    try {
      uploadResult = await uploadFileToStorage(file, userId, entityType, entityId);
    } catch (error) {
      const storageError = new FileUploadError(
        error instanceof Error ? error.message : 'Storage error occurred',
        'STORAGE_ERROR',
        {
          userId,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          entityType,
          entityId,
          errorDetails: {
            code: 'STORAGE_SERVICE_ERROR',
            message: error instanceof Error ? error.message : 'Unknown storage error'
          }
        }
      );
      
      trackFileUploadError(storageError, storageError.type, storageError.context);
      
      return NextResponse.json({
        error: 'Failed to upload file to storage service'
      }, { status: 500 });
    }
    
    if (!uploadResult) {
      const storageError = new FileUploadError(
        'File upload failed with no result',
        'STORAGE_ERROR',
        {
          userId,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          entityType,
          entityId,
          errorDetails: {
            code: 'UPLOAD_FAILED',
            message: 'File upload completed but no result was returned'
          }
        }
      );
      
      trackFileUploadError(storageError, storageError.type, storageError.context);
      
      return NextResponse.json({
        error: 'File upload failed'
      }, { status: 500 });
    }
    
    // If entity type and ID are provided, associate the file
    if (entityType && entityId) {
      try {
        await associateFileWithEntity(uploadResult.fileId, entityType, entityId, userId);
      } catch (error) {
        // Track association error but don't fail the upload
        const associationError = new FileUploadError(
          error instanceof Error ? error.message : 'Association error occurred',
          'ENTITY_ASSOCIATION_ERROR',
          {
            userId,
            fileId: uploadResult.fileId,
            fileType: file.type,
            fileName: file.name,
            fileSize: file.size,
            entityType,
            entityId,
            errorDetails: {
              code: 'ASSOCIATION_FAILED',
              message: error instanceof Error ? error.message : 'Failed to associate file with entity'
            }
          }
        );
        
        trackFileUploadError(associationError, associationError.type, associationError.context);
        
        // Return success with warning
        return NextResponse.json({
          success: true,
          warning: 'File uploaded but failed to associate with entity',
          fileId: uploadResult.fileId,
          url: uploadResult.url
        });
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      entityAssociated: !!(entityType && entityId)
    });
    
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in file upload:', error);
    
    const unexpectedError = new FileUploadError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'STORAGE_ERROR',
      {
        fileName: 'unknown',
        errorDetails: {
          code: 'UNEXPECTED_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    );
    
    trackFileUploadError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred during file upload'
    }, { status: 500 });
  }
} 