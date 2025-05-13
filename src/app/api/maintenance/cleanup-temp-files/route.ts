import { NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedFiles } from '@/utils/file-service';

/**
 * API route to clean up orphaned temporary files
 * This can be called by a CRON job or scheduler to regularly clean up temp files
 */
export async function POST(request: NextRequest) {
  try {
    // Get the secret key from the request headers to validate the request
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.MAINTENANCE_API_KEY;
    
    // Simple validation to prevent unauthorized access
    // For production, consider implementing more robust authentication
    if (!apiKey || !authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the time threshold from the request, defaulting to 24 hours
    const { searchParams } = new URL(request.url);
    const timeThresholdParam = searchParams.get('timeThreshold');
    const timeThreshold = timeThresholdParam ? parseInt(timeThresholdParam, 10) : 24;
    
    // Clean up orphaned files
    const result = await cleanupOrphanedFiles(timeThreshold);
    
    return NextResponse.json({
      message: `Successfully cleaned up ${result.deleted} orphaned files`,
      ...result
    });
  } catch (error: any) {
    console.error('Error cleaning up orphaned files:', error);
    return NextResponse.json(
      { error: 'Failed to clean up orphaned files', details: error.message || String(error) },
      { status: 500 }
    );
  }
}

/**
 * Documentation endpoint to get information about this API
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    description: 'API endpoint to clean up orphaned temporary files',
    usage: 'Send a POST request with a valid authorization header to run the cleanup',
    parameters: {
      timeThreshold: 'Optional: Number of hours after which temporary files are considered orphaned (default: 24)'
    }
  });
} 