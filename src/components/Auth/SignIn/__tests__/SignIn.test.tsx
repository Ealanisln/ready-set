import { expect, test, describe, beforeEach, mock } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import SignIn from "../index";

// Types
interface MockSignInResult {
  ok: boolean;
  error?: string | null;
}

interface MockSession {
  user: {
    isTemporaryPassword: boolean;
  };
}

// Create mock functions with explicit types
const mockPush = mock<() => Promise<void>>(() => Promise.resolve());
const mockSignIn = mock<() => Promise<MockSignInResult>>(() =>
  Promise.resolve({ ok: true, error: undefined }),
);
const mockGetSession = mock<() => Promise<MockSession>>(() =>
  Promise.resolve({ user: { isTemporaryPassword: false } }),
);
const mockToastSuccess = mock<(message: string) => void>(() => {});
const mockToastError = mock<(message: string) => void>(() => {});

// Mock modules using Bun's mock.module() API
mock.module("next-auth/react", () => ({
  signIn: mockSignIn,
  getSession: mockGetSession,
  default: { signIn: mockSignIn, getSession: mockGetSession },
}));

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  default: { useRouter: () => ({ push: mockPush }) },
}));

mock.module("react-hot-toast", () => ({
  success: mockToastSuccess,
  error: mockToastError,
  default: { success: mockToastSuccess, error: mockToastError },
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSignIn.mockClear();
    mockGetSession.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
  });

  describe("Initial Render", () => {
    test("renders all form elements", async () => {
      render(<SignIn />);

      expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(await screen.findByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(await screen.findByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(await screen.findByText(/forgot password/i)).toBeInTheDocument();
      expect(await screen.findByText(/not a member yet/i)).toBeInTheDocument();
    });

    test("renders with empty form fields", async () => {
      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i) as HTMLInputElement;
      const passwordInput = await screen.findByPlaceholderText(/password/i) as HTMLInputElement;

      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });

  describe("Form Validation", () => {
    test("shows required field errors on empty submission", async () => {
      render(<SignIn />);

      const submitButton = await screen.findByRole("button", { name: /sign in/i });
      await fireEvent.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    test("validates email format", async () => {
      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      await fireEvent.change(emailInput, {
        target: { value: "invalid-email" },
      });

      const submitButton = await screen.findByRole("button", { name: /sign in/i });
      await fireEvent.click(submitButton);

      expect(
        await screen.findByText(/please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  describe("Authentication Flow", () => {
    test("handles successful login", async () => {
      mockSignIn.mockImplementation(() =>
        Promise.resolve({ ok: true, error: undefined }),
      );

      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      const passwordInput = await screen.findByPlaceholderText(/password/i);
      const submitButton = await screen.findByRole("button", { name: /sign in/i });

      await fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });
      await fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Welcome back! Sign in successful.",
        );
      });
    });

    test("handles invalid credentials", async () => {
      mockSignIn.mockImplementation(() =>
        Promise.resolve({ ok: false, error: "CredentialsSignin" }),
      );

      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      const passwordInput = await screen.findByPlaceholderText(/password/i);
      const submitButton = await screen.findByRole("button", { name: /sign in/i });

      await fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      await fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Invalid email or password. Please try again.",
        );
      });
    });

    test("handles network error", async () => {
      mockSignIn.mockImplementation(() =>
        Promise.reject(new Error("Network error")),
      );

      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      const passwordInput = await screen.findByPlaceholderText(/password/i);
      const submitButton = await screen.findByRole("button", { name: /sign in/i });

      await fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });
      await fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Unable to connect to the server. Please check your internet connection and try again.",
        );
      });
    });
  });

  describe("Loading State", () => {
    test("shows loading state during submission", async () => {
      type PromiseResolverType = (value: MockSignInResult) => void;
      let promiseResolver: PromiseResolverType | undefined;

      const controlledPromise = new Promise<MockSignInResult>((resolve) => {
        promiseResolver = resolve;
      });

      mockSignIn.mockImplementation(() => controlledPromise);

      render(<SignIn />);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      const passwordInput = await screen.findByPlaceholderText(/password/i);
      const submitButton = await screen.findByRole("button", { name: /sign in/i });

      await fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });
      await fireEvent.click(submitButton);

      expect(await screen.findByText(/signing in/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      if (promiseResolver) {
        promiseResolver({ ok: true, error: undefined });
        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith("/");
        });
      }
    });
  });
});