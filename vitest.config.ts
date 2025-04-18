import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path for resolving aliases

export default defineConfig({
  plugins: [react()], // Add react plugin if you test React components
  test: {
    globals: true, // Enable Vitest globals (describe, it, expect, etc.)
    environment: 'jsdom', // Set environment for browser-like testing
    setupFiles: './vitest.setup.ts', // Specify setup file
    // Increase timeout if tests involving DB setup/reset take longer
    // testTimeout: 10000, 
    // poolOptions: {
    //   threads: {
    //     // Necessary for Prisma interaction in tests sometimes
    //     // useAtomics: true, 
    //   }
    // }
  },
  resolve: {
    alias: {
      // Configure path aliases to match tsconfig.json
      '@': path.resolve(__dirname, './src'), 
    },
  },
}); 