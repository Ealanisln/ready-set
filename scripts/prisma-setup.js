#!/usr/bin/env node

/**
 * This script ensures that Prisma client is generated before build
 * and handles any initialization issues that might occur in Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

try {
  log('Starting Prisma client setup...');
  
  // Check if Prisma schema exists
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Prisma schema not found at: ' + schemaPath);
  }
  
  log('Found Prisma schema, generating client...');
  
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Verify that Prisma client was generated
  const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
  if (!fs.existsSync(prismaClientPath)) {
    throw new Error('Prisma client not generated at: ' + prismaClientPath);
  }
  
  log('Prisma client generated successfully!');
  
  // Create a verification file to ensure Prisma client is initialized
  const verificationPath = path.join(process.cwd(), '.prisma-initialized');
  fs.writeFileSync(verificationPath, new Date().toISOString());
  
  log('Prisma setup complete!');
  process.exit(0);
} catch (error) {
  log(`Error during Prisma setup: ${error.message}`);
  process.exit(1);
} 