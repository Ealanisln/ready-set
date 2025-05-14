/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path for resolving aliases
import type { UserConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
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
} as UserConfig); 