#!/usr/bin/env node

/**
 * This script ensures that all Flower component files have lowercase versions.
 * Run this script directly if you're having issues with deployment.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const flowersDir = path.join(process.cwd(), 'src', 'components', 'Flowers');

// Components that need lowercase versions
const components = [
  'FlowerHero.tsx',
  'FlowerIcons.tsx',
  'PackageDelivery.tsx',
  'DeliveryWork.tsx',
  'DelicateBlooms.tsx',
  'ExpertSupportSection.tsx',
  'FAQSection.tsx'
];

// Make sure the Flowers directory exists
if (!fs.existsSync(flowersDir)) {
  console.error(`❌ Error: Flowers component directory not found at ${flowersDir}`);
  process.exit(1);
}

// Get the actual files in the directory
const actualFiles = fs.readdirSync(flowersDir);
console.log(`Found ${actualFiles.length} files in Flowers directory: ${actualFiles.join(', ')}`);

// Create lowercase versions
console.log('📄 Creating lowercase component files:');

let success = true;
components.forEach(component => {
  const lowercaseName = component.toLowerCase();
  const destPath = path.join(flowersDir, lowercaseName);
  
  console.log(`Processing: ${component} → ${lowercaseName}`);
  
  // First check if the lowercase version already exists
  if (fs.existsSync(destPath)) {
    console.log(`  ✓ Lowercase version already exists at ${lowercaseName}`);
    return;
  }
  
  // Look for any case variation that might exist
  const matchingFile = actualFiles.find(file => file.toLowerCase() === lowercaseName || file === component);
  
  if (matchingFile) {
    console.log(`  ✅ Found variation: ${matchingFile}`);
    
    // If the matched file isn't the lowercase version, copy it
    try {
      const sourcePath = path.join(flowersDir, matchingFile);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`  ✓ Copied ${matchingFile} → ${lowercaseName}`);
    } catch (err) {
      console.error(`  ❌ Failed to copy ${matchingFile}:`, err);
      success = false;
    }
    return;
  }
  
  console.error(`  ❌ No matching file found for ${component} or ${lowercaseName}`);
  success = false;
});

if (success) {
  console.log('\n✅ All lowercase component files have been created successfully!');
  
  // Verify
  console.log('\n📋 Flowers directory contents:');
  fs.readdirSync(flowersDir).forEach(file => {
    console.log(`  - ${file}`);
  });
} else {
  console.error('\n⚠️ Some errors occurred. Please check the messages above.');
  process.exit(1);
} 