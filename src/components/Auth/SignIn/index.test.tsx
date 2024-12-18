// __tests__/components/Auth/SignIn/index.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Signin from '@/components/Auth/SignIn';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn()
}));

// Create mock functions
const toastFn = jest.fn();
const successFn = jest.fn();
const errorFn = jest.fn();

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
  const toast = (...args: any[]) => toastFn(...args);
  toast.success = successFn;
  toast.error = errorFn;
  return toast;
});

describe('SignIn Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the signin form', () => {
    render(<Signin />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates empty fields', async () => {
    render(<Signin />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('validates invalid email format', async () => {
    render(<Signin />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });
    (getSession as jest.Mock).mockResolvedValueOnce({
      user: { isTemporaryPassword: false }
    });

    render(<Signin />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(successFn).toHaveBeenCalledWith('Welcome back! Sign in successful.');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles temporary password redirect', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });
    (getSession as jest.Mock).mockResolvedValueOnce({
      user: { isTemporaryPassword: true }
    });

    render(<Signin />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'temp123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toastFn).toHaveBeenCalledWith(
        'Please change your temporary password to continue.',
        expect.any(Object)
      );
      expect(mockPush).toHaveBeenCalledWith('/change-password');
    });
  });

  it('handles invalid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: 'CredentialsSignin'
    });

    render(<Signin />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(errorFn).toHaveBeenCalledWith(
        'Invalid email or password. Please try again.'
      );
    });
  });

  it('handles network errors', async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Signin />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(errorFn).toHaveBeenCalledWith(
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    });
  });
});