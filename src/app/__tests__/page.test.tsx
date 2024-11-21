import { expect, test, describe } from "bun:test";
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toBeInTheDocument(): boolean;
    toHaveTextContent(text: string): boolean;
    toBeVisible(): boolean;
  }
}

describe('Home Page', () => {
  test('renders heading', () => {
    render(<Page />);
    
    const heading = screen.getByRole('heading', {
      name: /welcome/i,
    });

    expect(heading).toBeInTheDocument();
  });
});