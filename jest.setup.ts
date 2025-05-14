// jest.setup.ts
// Polyfills for Jest environment

import '@testing-library/jest-dom';

import { Request, Response } from 'node-fetch';

global.Request = Request as any;
global.Response = Response as any;

// PointerEvent polyfill for JSDOM (needed for Radix UI components tested with user-event)
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0; // Provide a default value when pointerId is undefined
    }
  }
  window.PointerEvent = PointerEvent as any;
}

if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function(pointerId: number) { 
    // No-op: JSDOM doesn't support pointer capture
  };
}

if (typeof Element !== 'undefined' && !Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function(pointerId: number) {
    // No-op: JSDOM doesn't support pointer capture
  };
}

if (typeof Element !== 'undefined' && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function(pointerId: number): boolean {
    // No-op: JSDOM doesn't support pointer capture
    return false;
  };
}

// You can add other global setup here if needed
// For example, mocking global timers, etc. 