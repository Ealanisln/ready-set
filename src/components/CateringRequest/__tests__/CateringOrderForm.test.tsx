import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CateringOrderForm from '../CateringOrderForm';
import { createClient } from '@/utils/supabase/client';
import { Address } from '@/types/address';

// Mock the Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-user-id' } } },
        error: null
      }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      })
    },
  })),
}));

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock addresses data
const mockAddresses: Address[] = [
  {
    id: '1',
    street1: '123 Test St',
    street2: null,
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    county: null,
    locationNumber: null,
    parkingLoading: null,
    name: null,
    isRestaurant: false,
    isShared: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null
  },
];

describe('CateringOrderForm', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock fetch implementation
    mockFetch.mockImplementation((url) => {
      if (url.includes('/api/addresses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'test-order-id' }),
      });
    });
  });

  it('renders the form correctly', async () => {
    await act(async () => {
      render(<CateringOrderForm />);
    });

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special instructions/i)).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    await act(async () => {
      render(<CateringOrderForm />);
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/event name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/event name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully with valid data', async () => {
    await act(async () => {
      render(<CateringOrderForm />);
    });

    // Fill in form fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/event name/i), {
        target: { value: 'Test Event' },
      });
      fireEvent.change(screen.getByLabelText(/event date/i), {
        target: { value: '2024-04-12' },
      });
      fireEvent.change(screen.getByLabelText(/event time/i), {
        target: { value: '10:00' },
      });
      fireEvent.change(screen.getByLabelText(/number of guests/i), {
        target: { value: '50' },
      });
      fireEvent.change(screen.getByLabelText(/budget/i), {
        target: { value: '1000.00' },
      });
    });

    // Select an address
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/address/i), {
        target: { value: '1' },
      });
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"eventName":"Test Event"'),
      });
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock fetch to return an error
    mockFetch.mockImplementationOnce((url) => {
      if (url.includes('/api/addresses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Failed to create order' }),
      });
    });

    await act(async () => {
      render(<CateringOrderForm />);
    });

    // Fill in form fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/event name/i), {
        target: { value: 'Test Event' },
      });
      fireEvent.change(screen.getByLabelText(/event date/i), {
        target: { value: '2024-04-12' },
      });
      fireEvent.change(screen.getByLabelText(/event time/i), {
        target: { value: '10:00' },
      });
      fireEvent.change(screen.getByLabelText(/number of guests/i), {
        target: { value: '50' },
      });
      fireEvent.change(screen.getByLabelText(/budget/i), {
        target: { value: '1000.00' },
      });
    });

    // Select an address
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/address/i), {
        target: { value: '1' },
      });
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to submit catering request/i)).toBeInTheDocument();
    });
  });
}); 