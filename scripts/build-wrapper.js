// This script is a wrapper for the Next.js build process
// It handles differences between local and Vercel builds

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Run the file copy script first
  console.log('📁 Creating case-insensitive file copies for Vercel compatibility...');
  require('./create-case-links');

  // Determine if we're in Vercel
  const isVercel = process.env.VERCEL === '1';

  // Build command
  let buildCommand = 'prisma generate && ';

  if (isVercel) {
    console.log('🔄 Running build in Vercel environment with TypeScript case-insensitivity');
    
    // Use special tsconfig for Vercel builds
    buildCommand += 'next build';
  } else {
    console.log('🔄 Running build in local environment');
    
    // Use regular build for local
    buildCommand += 'next build';
  }

  // Execute the build
  console.log(`Executing: ${buildCommand}`);
  execSync(buildCommand, { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed with details:', error);
  process.exit(1);
} 