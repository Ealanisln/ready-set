/**
 * Script to detect potential case sensitivity issues in imports
 * Run with: node src/scripts/check-case-sensitivity.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Track files by lowercase name to detect case conflicts
const fileMap = new Map();
const warnings = [];

// Find all TypeScript/JavaScript files
const findFiles = () => {
  return glob.sync('src/**/*.{ts,tsx,js,jsx}', { 
    ignore: ['**/node_modules/**', '**/.next/**'] 
  });
};

// Scan for all files and check for case conflicts
const scanForConflicts = () => {
  const files = findFiles();
  
  files.forEach(filePath => {
    const dirName = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const lowerFileName = fileName.toLowerCase();
    
    if (!fileMap.has(dirName)) {
      fileMap.set(dirName, new Map());
    }
    
    const dirMap = fileMap.get(dirName);
    
    if (dirMap.has(lowerFileName)) {
      const existing = dirMap.get(lowerFileName);
      if (existing !== fileName) {
        warnings.push({
          dir: dirName,
          file1: existing,
          file2: fileName
        });
      }
    } else {
      dirMap.set(lowerFileName, fileName);
    }
  });
};

// Main execution
scanForConflicts();

if (warnings.length > 0) {
  console.log('\n🚨 POTENTIAL CASE SENSITIVITY ISSUES DETECTED 🚨');
  console.log('The following files have the same name with different casing:');
  console.log('These may cause build failures in case-sensitive environments like Linux/Vercel.\n');
  
  warnings.forEach(warning => {
    console.log(`Directory: ${warning.dir}`);
    console.log(`   Files with conflicting names: ${warning.file1} and ${warning.file2}`);
    console.log('');
  });
  
  console.log('To fix these issues:');
  console.log('1. Rename the files to have unique case-insensitive names');
  console.log('2. Update all imports to use the new names');
  console.log('3. Run this script again to verify the issues are resolved\n');
  
  process.exit(1);
} else {
  console.log('✅ No case sensitivity issues detected!');
} 