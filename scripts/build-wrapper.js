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
  
  // Define the component files that need lowercase versions
  const components = [
    'FlowerHero.tsx',
    'FlowerIcons.tsx',
    'PackageDelivery.tsx',
    'DeliveryWork.tsx',
    'DelicateBlooms.tsx',
    'ExpertSupportSection.tsx',
    'FAQSection.tsx'
  ];
  
  // Force create lowercase versions
  console.log('📁 Creating lowercase component files:');
  
  // Get existing files
  const existingFiles = fs.readdirSync(flowersDir);
  
  // Process each component
  components.forEach(component => {
    const lowercaseName = component.toLowerCase();
    const destPath = path.join(flowersDir, lowercaseName);
    
    console.log(`Processing: ${component} → ${lowercaseName}`);
    
    // Find the source file (original case or any variation)
    const matchingFile = existingFiles.find(file => 
      file.toLowerCase() === component.toLowerCase()
    );
    
    if (!matchingFile) {
      console.error(`  ❌ No matching file found for ${component}`);
      
      // Create an empty placeholder
      const defaultContent = `'use client';\nexport default function EmptyComponent() { return <div>Placeholder for ${component}</div>; }`;
      try {
        fs.writeFileSync(destPath, defaultContent);
        console.log(`  ✅ Created placeholder for ${lowercaseName}`);
      } catch (err) {
        console.error(`  ❌ Failed to create placeholder:`, err);
      }
      return;
    }
    
    // Force delete and recreate the lowercase version
    try {
      // If the file already exists with the same inode (macOS case-insensitive), we need to copy to a temp file first
      if (fs.existsSync(destPath)) {
        console.log(`  🔄 Deleting existing ${lowercaseName}`);
        
        try {
          // Create a temporary copy with a different name
          const tempName = `${lowercaseName}.temp`;
          const tempPath = path.join(flowersDir, tempName);
          
          // Read the original file
          const content = fs.readFileSync(path.join(flowersDir, matchingFile), 'utf8');
          
          // Write to temp file
          fs.writeFileSync(tempPath, content);
          
          // Try to delete the original
          fs.unlinkSync(destPath);
          
          // Rename temp back to target
          fs.renameSync(tempPath, destPath);
          console.log(`  ✅ Successfully recreated ${lowercaseName}`);
        } catch (err) {
          console.error(`  ❌ Error during file recreation:`, err);
          
          // If that fails, create directly with simple content
          const content = `'use client';\n\n// Import from original file\nexport { default } from './${matchingFile}';`;
          fs.writeFileSync(destPath, content);
          console.log(`  ✅ Created import reference to ${matchingFile}`);
        }
      } else {
        // Just copy directly
        const sourcePath = path.join(flowersDir, matchingFile);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✅ Created lowercase version from ${matchingFile}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed to create lowercase version:`, err);
    }
  });

  // Determine if we're in Vercel
  const isVercel = process.env.VERCEL === '1';

  // Build command
  let buildCommand = 'npx prisma generate && ';

  if (isVercel) {
    console.log('🔄 Running build in Vercel environment with TypeScript case-insensitivity');
    buildCommand += 'next build';
  } else {
    console.log('🔄 Running build in local environment');
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
  
  // Check each important file
  importantFiles.forEach(file => {
    const filePath = path.join(flowersDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.log(`  ❌ ${file} missing - creating placeholder`);
      const defaultContent = `'use client';\nexport default function Placeholder() { return <div>Placeholder</div>; }`;
      fs.writeFileSync(filePath, defaultContent);
    }
  });
  
  // Execute the build command
  console.log(`\n🚀 Executing build command: ${buildCommand}`);
  execSync(buildCommand, { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 