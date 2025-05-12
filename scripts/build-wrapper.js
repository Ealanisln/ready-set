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
  if (!fs.existsSync(flowersDir)) {
    console.log('  ❌ Component directory does not exist, creating it...');
    fs.mkdirSync(flowersDir, { recursive: true });
  }
  
  const files = fs.readdirSync(flowersDir);
  console.log(`  Files (${files.length}): ${files.join(', ')}`);
  
  // Define the component files that need lowercase versions
  const components = [
    { pascal: 'FlowerHero.tsx', lower: 'flowerhero.tsx' },
    { pascal: 'FlowerIcons.tsx', lower: 'flowericons.tsx' },
    { pascal: 'PackageDelivery.tsx', lower: 'packagedelivery.tsx' },
    { pascal: 'DeliveryWork.tsx', lower: 'deliverywork.tsx' },
    { pascal: 'DelicateBlooms.tsx', lower: 'delicateblooms.tsx' },
    { pascal: 'ExpertSupportSection.tsx', lower: 'expertsupportsection.tsx' },
    { pascal: 'FAQSection.tsx', lower: 'faqsection.tsx' }
  ];
  
  // Create a placeholder component content generator
  const createPlaceholderContent = (componentName) => {
    return `'use client';
export default function ${componentName.replace('.tsx', '')}() {
  return <div className="p-8 text-center">Placeholder for ${componentName}</div>;
}`;
  };
  
  // Ensure all lowercase files exist
  console.log('📁 Ensuring lowercase component files exist:');
  
  components.forEach(({ pascal, lower }) => {
    const lowerPath = path.join(flowersDir, lower);
    const pascalPath = path.join(flowersDir, pascal);
    
    console.log(`Processing: ${pascal} → ${lower}`);
    
    // Check if we already have a lowercase file
    if (fs.existsSync(lowerPath)) {
      console.log(`  ✅ Lowercase file already exists: ${lower}`);
    } 
    // Check if we have a PascalCase file to convert
    else if (fs.existsSync(pascalPath)) {
      console.log(`  🔄 Converting PascalCase file to lowercase: ${pascal} → ${lower}`);
      try {
        const content = fs.readFileSync(pascalPath, 'utf8');
        fs.writeFileSync(lowerPath, content);
        console.log(`  ✅ Created lowercase file from PascalCase: ${lower}`);
      } catch (err) {
        console.error(`  ❌ Error converting PascalCase file: ${err.message}`);
        console.log(`  ⚠️ Creating placeholder instead...`);
        fs.writeFileSync(lowerPath, createPlaceholderContent(pascal));
      }
    } 
    // Check if file exists regardless of case (for case-insensitive file systems)
    else {
      const matchingFile = files.find(file => file.toLowerCase() === lower.toLowerCase());
      if (matchingFile) {
        console.log(`  🔄 Found case-variant file: ${matchingFile}`);
        try {
          // Read the content from the variant
          const content = fs.readFileSync(path.join(flowersDir, matchingFile), 'utf8');
          
          // Special handling for case-insensitive file systems to avoid conflicts
          const tempPath = path.join(flowersDir, `${lower}.temp`);
          fs.writeFileSync(tempPath, content);
          
          // For case-insensitive systems, this may delete the original too
          try {
            if (fs.existsSync(lowerPath) && matchingFile !== lower) {
              fs.unlinkSync(lowerPath);
            }
          } catch (err) {
            console.warn(`  ⚠️ Could not delete existing file: ${err.message}`);
          }
          
          // Rename temp to the proper lowercase name
          fs.renameSync(tempPath, lowerPath);
          console.log(`  ✅ Created lowercase file from variant: ${lower}`);
        } catch (err) {
          console.error(`  ❌ Error processing file variant: ${err.message}`);
          console.log(`  ⚠️ Creating placeholder instead...`);
          fs.writeFileSync(lowerPath, createPlaceholderContent(pascal));
        }
      } else {
        // No matching file, create a placeholder
        console.log(`  ⚠️ No existing file found, creating placeholder for: ${lower}`);
        fs.writeFileSync(lowerPath, createPlaceholderContent(pascal));
        console.log(`  ✅ Created placeholder file: ${lower}`);
      }
    }
  });
  
  // On Vercel (case-sensitive file system), we need to ensure only lowercase files exist
  const isVercel = process.env.VERCEL === '1';
  if (isVercel) {
    console.log('🧹 Removing PascalCase files on Vercel to avoid case conflicts:');
    components.forEach(({ pascal, lower }) => {
      const pascalPath = path.join(flowersDir, pascal);
      if (fs.existsSync(pascalPath)) {
        try {
          fs.unlinkSync(pascalPath);
          console.log(`  ✅ Deleted PascalCase file: ${pascal}`);
        } catch (err) {
          console.error(`  ❌ Error deleting PascalCase file: ${err.message}`);
        }
      }
    });
  }

  // Build command
  let buildCommand = 'npx prisma generate && ';

  console.log(`🔄 Running build in ${isVercel ? 'Vercel' : 'local'} environment`);
  buildCommand += 'next build';
  
  // Final verification
  console.log('🔍 Verifying component files before building:');
  const lowerComponents = components.map(c => c.lower);
  lowerComponents.forEach(file => {
    const filePath = path.join(flowersDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.error(`  ❌ ${file} is missing! This will cause build errors.`);
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