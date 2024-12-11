// test-utils.tsx
import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

function customRender(
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <div id="test-wrapper" data-testid="test-wrapper">
        {children}
      </div>
    );
  };

  return rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };