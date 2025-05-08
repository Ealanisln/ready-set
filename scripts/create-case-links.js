// This script creates case-insensitive aliases for components
// to ensure compatibility with case-sensitive environments like Linux/Vercel
const fs = require('fs');
const path = require('path');

const flowersDir = path.join(process.cwd(), 'src', 'components', 'Flowers');

// These are the components that need case-insensitive aliases
const componentsToLink = [
  'FlowerHero.tsx',
  'FlowerIcons.tsx',
  'PackageDelivery.tsx',
  'DeliveryWork.tsx',
  'DelicateBlooms.tsx',
  'ExpertSupportSection.tsx',
  'FAQSection.tsx'
];

// Check if the source files exist first
let missingFiles = [];
componentsToLink.forEach(filename => {
  const sourcePath = path.join(flowersDir, filename);
  if (!fs.existsSync(sourcePath)) {
    missingFiles.push(filename);
  }
});

if (missingFiles.length > 0) {
  console.error(`⚠️ Warning: The following source files are missing: ${missingFiles.join(', ')}`);
  console.error(`Current directory contents: ${fs.readdirSync(flowersDir).join(', ')}`);
}

// Create lowercase copies
let createdCount = 0;
let skippedCount = 0;
let errorCount = 0;

componentsToLink.forEach(filename => {
  const lowercaseFilename = filename.toLowerCase();
  const sourcePath = path.join(flowersDir, filename);
  const destPath = path.join(flowersDir, lowercaseFilename);

  // Skip if source doesn't exist
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Error: Source file ${filename} doesn't exist, skipping`);
    errorCount++;
    return;
  }

  // Skip if already exists
  if (fs.existsSync(destPath)) {
    console.log(`Skipping: ${lowercaseFilename} already exists`);
    skippedCount++;
    return;
  }

  try {
    // Copy the file instead of symlinking since some environments don't support symlinks
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Created copy for ${filename} → ${lowercaseFilename}`);
    createdCount++;
  } catch (error) {
    console.error(`❌ Error creating file for ${filename}:`, error);
    errorCount++;
  }
});

console.log(`✅ Case-insensitive file copy summary: Created ${createdCount}, Skipped ${skippedCount}, Errors ${errorCount}`);

// List all the files in the directory for verification
console.log('📂 Files in component directory:');
fs.readdirSync(flowersDir).forEach(file => {
  console.log(`  - ${file}`);
}); 