// scripts/copy-og-images.ts
import fs from 'fs';
import path from 'path';

// Source files
const sourceDir: string = path.join(process.cwd(), 'app');
const sourceFiles: string[] = [
  'opengraph-image.png',
  'twitter-image.png',
  'opengraph-image.alt.txt',
  'twitter-image.alt.txt'
];

// Function to find all directories recursively
function findAllDirs(dir: string, dirs: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath: string = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      dirs.push(fullPath);
      findAllDirs(fullPath, dirs);
    }
  }
  
  return dirs;
}

// Get all directories in app/ except for the root
const allDirs: string[] = findAllDirs(sourceDir).filter((dir: string) => dir !== sourceDir);

// Copy files to each directory
for (const dir of allDirs) {
  // Skip some directories if needed
  if (dir.includes('api') || dir.includes('_') || dir.includes('node_modules')) {
    continue;
  }
  
  console.log(`Copying OG images to ${dir}`);
  
  for (const file of sourceFiles) {
    const sourcePath: string = path.join(sourceDir, file);
    const destPath: string = path.join(dir, file);
    
    // Only copy if source file exists
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

console.log('OG images copied to all route segments!');