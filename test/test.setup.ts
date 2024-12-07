// test.setup.ts
import { afterEach } from "bun:test";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Add any custom matchers or global test configuration here
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      // Add other custom matchers as needed
    }
  }
}

// Mock Next.js routing
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
    };
  },
  usePathname() {
    return "/";
  },
}));

// Add any global mocks or setup here
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};