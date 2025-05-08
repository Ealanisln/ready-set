// This script is a wrapper for the Next.js build process
// It handles differences between local and Vercel builds

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Log environment for debugging
  console.log('🔍 Build environment:');
  console.log(`  - Current directory: ${process.cwd()}`);
  console.log(`  - Is Vercel: ${process.env.VERCEL === '1' ? 'Yes' : 'No'}`);
  console.log(`  - Node version: ${process.version}`);
  
  // Verify component directory structure
  const flowersDir = path.join(process.cwd(), 'src', 'components', 'Flowers');
  console.log(`📂 Checking component directory: ${flowersDir}`);
  if (fs.existsSync(flowersDir)) {
    console.log('  Component directory exists');
    const files = fs.readdirSync(flowersDir);
    console.log(`  Files (${files.length}): ${files.join(', ')}`);
  } else {
    console.error('❌ Component directory does not exist!');
  }
  
  // Run the file copy script
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

  // Verify that lowercase files exist before building
  const importantFiles = [
    'flowerhero.tsx',
    'flowericons.tsx', 
    'packagedelivery.tsx',
    'deliverywork.tsx',
    'delicateblooms.tsx',
    'expertsupportsection.tsx',
    'faqsection.tsx'
  ];
  
  console.log('🔍 Verifying lowercase files before building:');
  importantFiles.forEach(file => {
    const filePath = path.join(flowersDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.error(`  ❌ ${file} is missing!`);
    }
  });

  // Execute the build
  console.log(`Executing: ${buildCommand}`);
  execSync(buildCommand, { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed with details:', error);
  process.exit(1);
} 