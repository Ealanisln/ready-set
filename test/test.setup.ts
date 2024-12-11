// test/test.setup.ts
import { afterEach, beforeAll, expect, mock } from "bun:test";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { JSDOM } from "jsdom";

// Create and setup JSDOM
const dom = new JSDOM(
  `
  <!DOCTYPE html>
  <html>
    <head></head>
    <body></body>
  </html>
`,
  {
    url: "http://localhost",
    pretendToBeVisual: true,
  },
);

// Setup global window and document
const window = dom.window as unknown as Window & typeof globalThis;
const document = window.document;

// Add JSDOM globals
global.window = window;
global.document = document;
global.navigator = window.navigator;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;
global.HTMLDivElement = window.HTMLDivElement;
global.Node = window.Node;
global.NodeList = window.NodeList;
global.Event = window.Event;
global.MouseEvent = window.MouseEvent;

// Add other necessary globals
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock matchMedia
global.window.matchMedia = mock(() => ({
  matches: false,
  media: "",
  onchange: null,
  addListener: mock(() => {}),
  removeListener: mock(() => {}),
  addEventListener: mock(() => {}),
  removeEventListener: mock(() => {}),
  dispatchEvent: mock(() => false),
}));

// Add ResizeObserver mock
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;

// Extend Bun's expect with Testing Library matchers
declare module "bun:test" {
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.extend, T> {}
}

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation
mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mock(() => {}),
    replace: mock(() => {}),
    prefetch: mock(() => {}),
    back: mock(() => {}),
    pathname: "/",
  }),
  usePathname: () => "/",
}));
