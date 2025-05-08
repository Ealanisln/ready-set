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

// For each component, create a lowercase copy in the same directory
componentsToLink.forEach(filename => {
  const lowercaseFilename = filename.toLowerCase();
  const sourcePath = path.join(flowersDir, filename);
  const destPath = path.join(flowersDir, lowercaseFilename);

  // Skip if already exists
  if (fs.existsSync(destPath)) {
    console.log(`Skipping: ${lowercaseFilename} already exists`);
    return;
  }

  try {
    // Copy the file instead of symlinking since some environments don't support symlinks
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Created copy for ${filename} → ${lowercaseFilename}`);
  } catch (error) {
    console.error(`Error creating file for ${filename}:`, error);
  }
});

console.log('All case-insensitive file copies created successfully!'); 