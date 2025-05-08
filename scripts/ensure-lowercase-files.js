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

// Create lowercase versions
console.log('📄 Creating lowercase component files:');

let success = true;
components.forEach(component => {
  const sourcePath = path.join(flowersDir, component);
  const lowercaseName = component.toLowerCase();
  const destPath = path.join(flowersDir, lowercaseName);
  
  console.log(`Processing: ${component} → ${lowercaseName}`);
  
  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`  ❌ Source file ${component} doesn't exist!`);
    console.log(`  Checking for mixed-case variations...`);
    
    // Try to find a variation of the filename with a different case
    const files = fs.readdirSync(flowersDir);
    const matchingFile = files.find(file => file.toLowerCase() === lowercaseName);
    
    if (matchingFile) {
      console.log(`  ✅ Found variation: ${matchingFile}`);
      // If the matched file isn't the lowercase version, copy it
      if (matchingFile !== lowercaseName) {
        try {
          const altSourcePath = path.join(flowersDir, matchingFile);
          fs.copyFileSync(altSourcePath, destPath);
          console.log(`  ✓ Copied ${matchingFile} → ${lowercaseName}`);
        } catch (err) {
          console.error(`  ❌ Failed to copy ${matchingFile}:`, err);
          success = false;
        }
      } else {
        console.log(`  ✓ Lowercase version already exists`);
      }
    } else {
      console.error(`  ❌ No matching file found for ${component}`);
      success = false;
    }
    return;
  }
  
  // Check if destination already exists
  if (fs.existsSync(destPath)) {
    console.log(`  ✓ Lowercase version already exists`);
    return;
  }
  
  // Create the lowercase version
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ Created lowercase version`);
  } catch (err) {
    console.error(`  ❌ Failed to create lowercase version:`, err);
    success = false;
  }
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