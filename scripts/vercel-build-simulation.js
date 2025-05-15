#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔄 Simulating Vercel build environment...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Clean previous builds
  console.log('📦 Cleaning previous builds...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Run type checking
  console.log('🔍 Running type checking...');
  execSync('node scripts/type-check.js', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build the project with Vercel's exact configuration
  console.log('🏗️ Building the Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('✅ Vercel build simulation completed successfully');
} catch (error) {
  console.error('❌ Vercel build simulation failed');
  process.exit(1);
} 