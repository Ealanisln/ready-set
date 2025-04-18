// vitest.setup.ts
import '@testing-library/jest-dom/vitest'; // Import the matchers
import { vi } from 'vitest'; // Import vi

// --- Mock Pointer Events for Radix --- 
// JSDOM doesn't support Pointer Events, which Radix uses.
if (typeof window !== 'undefined') {
  // Mock Element.prototype.hasPointerCapture
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  }
  // Mock Element.prototype.releasePointerCapture
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = vi.fn();
  }
}
// -----------------------------------

// Optional: Extend Vitest's expect assertions with DOM matchers if needed
// If you rely heavily on `@testing-library/jest-dom` matchers, you might need a similar library for Vitest
// import '* as matchers from '@testing-library/jest-dom/matchers'';
// import { expect } from 'vitest';
// expect.extend(matchers);

// Optional: Add cleanup for testing-library/react if used
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup(); // Run cleanup after each test
});

// Add any other global setup needed for your tests here

console.log("Vitest setup file loaded."); 