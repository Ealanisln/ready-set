// src/components/Auth/SignIn/__tests__/SignIn.test.tsx
import { expect, test, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import SignIn from "../index";

describe("SignIn Component", () => {
  test("renders sign in form", async () => {
    render(<SignIn />);
    
    // Using await with findByPlaceholderText for more reliable testing
    const emailInput = await screen.findByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });
});