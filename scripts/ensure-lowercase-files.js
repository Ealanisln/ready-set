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
  fs.mkdirSync(flowersDir, { recursive: true });
  console.log(`✅ Created Flowers component directory`);
}

// Get the actual files in the directory
const actualFiles = fs.readdirSync(flowersDir);
console.log(`Found ${actualFiles.length} files in Flowers directory: ${actualFiles.join(', ')}`);

// Create placeholder component template
const createPlaceholderComponent = (name) => {
  return `'use client';

export default function ${name.replace('.tsx', '')}() {
  return (
    <div className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Placeholder for ${name}</h2>
        <p className="text-lg text-gray-600">
          This component was automatically generated. Replace with actual implementation.
        </p>
      </div>
    </div>
  );
}
`;
};

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
    // Delete any PascalCase version if it exists (only if different from lowercase)
    const exactMatch = actualFiles.find(file => file === component);
    if (exactMatch && exactMatch !== lowercaseName) {
      try {
        fs.unlinkSync(path.join(flowersDir, exactMatch));
        console.log(`  ✅ Deleted PascalCase version: ${exactMatch}`);
      } catch (err) {
        console.error(`  ⚠️ Could not delete PascalCase version: ${err.message}`);
      }
    }
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
      
      // If the source file is not the lowercase version, delete it after copying
      if (matchingFile !== lowercaseName) {
        fs.unlinkSync(sourcePath);
        console.log(`  ✅ Deleted original after copying: ${matchingFile}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed to copy/delete ${matchingFile}:`, err);
      success = false;
    }
    return;
  }
  
  // If we got here, we need to create a placeholder file
  console.log(`  ⚠️ No matching file found for ${component} or ${lowercaseName}, creating placeholder`);
  try {
    fs.writeFileSync(destPath, createPlaceholderComponent(component));
    console.log(`  ✅ Created placeholder component for ${lowercaseName}`);
  } catch (err) {
    console.error(`  ❌ Failed to create placeholder:`, err);
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