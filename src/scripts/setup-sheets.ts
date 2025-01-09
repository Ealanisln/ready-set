// src/scripts/setup-sheeets.ts

import { FormSubmissionService } from '@lib/form-submissions';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setupSheet() {
  try {
    console.log('Starting sheet headers setup...');
    
    // Validate environment variables
    if (!process.env.GOOGLE_SHEETS_SHEET_ID) {
      throw new Error('GOOGLE_SHEETS_SHEET_ID environment variable is not set');
    }
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL environment variable is not set');
    }
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('GOOGLE_SHEETS_PRIVATE_KEY environment variable is not set');
    }

    // Set up the headers
    await FormSubmissionService.setupSheetHeaders();
    
    console.log('Headers set up successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up headers:', error);
    process.exit(1);
  }
}

// Run the setup
setupSheet();