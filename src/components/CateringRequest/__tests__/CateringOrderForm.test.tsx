import React from 'react';
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CateringOrderForm from '../CateringOrderForm';
import { Address } from '@/types/address';
import { vi } from 'vitest';

// Mock the internal AddressManager component
const mockHandleAddressSelect = vi.fn(); // Mock function to simulate selection
vi.mock('@/components/AddressManager', () => ({
  __esModule: true,
  default: (props: { onAddressSelect: (id: string) => void }) => {
    // Render a simple placeholder or nothing
    // Expose the onAddressSelect prop so the test can call it
    mockHandleAddressSelect.mockImplementation(props.onAddressSelect); 
    return <div data-testid="mock-address-manager">Mock Address Manager</div>;
  },
}));

// Mock scrollIntoView for Radix components in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock the Supabase client more accurately
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(() => {
    // Store the callback for onAuthStateChange
    let authCallback: (event: string, session: any) => void = () => {};
    const mockSupabase = {
      auth: {
        // Ensure getUser returns the correct nested structure
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', email: 'test@example.com' } },
          error: null,
        }),
        // Provide a way to simulate auth state changes if needed
        onAuthStateChange: vi.fn((callback) => {
          authCallback = callback; // Store the callback
          // Simulate initial check or specific event if needed upon registration
          // Example: Simulate initial state check might return the current user
          // Promise.resolve().then(() => callback('INITIAL_SESSION', { user: { id: 'test-user-id' } }));
          return {
            data: { subscription: { unsubscribe: vi.fn() } },
          };
        }),
        // Add other auth methods if used by the components (e.g., signIn, signOut)
      },
      // Mock other Supabase methods if used (e.g., from, rpc)
    };
    // Add a way to manually trigger auth state change for testing different scenarios
    // (mockSupabase as any).triggerAuthStateChange = (event: string, session: any) => {
    //   authCallback(event, session);
    // };
    return mockSupabase;
  }),
}));

// Mock the fetch function more robustly
const mockFetch = vi.fn();
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
    vi.clearAllMocks();
    mockHandleAddressSelect.mockClear(); // Clear address select mock specifically
    
    // Mock fetch implementation - handle different endpoints and methods
    mockFetch.mockImplementation(async (url: RequestInfo | URL, options?: RequestInit): Promise<Response | { ok: boolean; json: () => Promise<any> }> => {
      const urlString = url.toString();
      
      // Handle address fetching (used by AddressManager) - Revert to simpler mock
      if (urlString.includes('/api/addresses') && options?.method !== 'POST') {
        // Return a simple object structure instead of new Response()
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        });
      }
      
      // Handle order creation
      if (urlString.includes('/api/orders') && options?.method === 'POST') {
        // Simulate successful creation
        return new Response(JSON.stringify({ id: 'test-order-id', message: 'Order created' }), {
          status: 201, // Use 201 for successful creation
          headers: { 'Content-Type': 'application/json' },
        });
        // To simulate an error:
        // return new Response(JSON.stringify({ message: 'Failed to create order' }), {
        //   status: 500,
        //   headers: { 'Content-Type': 'application/json' },
        // });
      }
      
      // Default fallback for unhandled requests
      return new Response(JSON.stringify({ message: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  it('renders the form correctly and loads addresses', async () => {
    // Use act for initial render which includes async operations (auth, address fetch)
    await act(async () => {
      render(<CateringOrderForm />);
    });

    // Check that the mocked AddressManager is rendered
    expect(screen.getByTestId('mock-address-manager')).toBeInTheDocument(); 

    // Check other form fields
    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special instructions/i)).toBeInTheDocument();
    
    // Verify fetch was called for addresses (AddressManager might still fetch internally)
    // expect(mockFetch).toHaveBeenCalledWith(
    //   expect.stringContaining('/api/addresses?filter=all')
    // ); // Commenting out as AddressManager is mocked
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<CateringOrderForm />);
    });

    const submitButton = screen.getByRole('button', { name: /submit request/i });
    await act(async () => {
      await user.click(submitButton);
    });

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/event name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address must be selected/i)).toBeInTheDocument(); // Add check for address validation
    });
  });

  it('submits the form successfully with valid data', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<CateringOrderForm />);
    });
    const eventNameInput = screen.getByLabelText(/event name/i);
    const eventDateInput = screen.getByLabelText(/event date/i);
    const eventTimeInput = screen.getByLabelText(/event time/i);
    const numberOfGuestsInput = screen.getByLabelText(/number of guests/i);
    const budgetInput = screen.getByLabelText(/budget/i);
    const submitButton = screen.getByRole('button', { name: /submit request/i });

    await act(async () => {
      await user.type(eventNameInput, 'Test Event');
      await user.type(eventDateInput, '2024-12-31');
      await user.type(eventTimeInput, '10:00');
      await user.type(numberOfGuestsInput, '50');
      await user.type(budgetInput, '1000.00');

      // Simulate address selection via the mocked component's prop
      mockHandleAddressSelect('1'); // Directly call the mocked handler with address ID '1'
      
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringMatching(
          /"eventName":"Test Event".*"addressId":"1".*"userId":"test-user-id"/s
        ),
      });

      const orderCall = mockFetch.mock.calls.find(
        (call) => call[0] === '/api/orders' && call[1]?.method === 'POST'
      );
      expect(orderCall).toBeDefined();
      if (orderCall && orderCall[1]?.body) {
        const requestBody = JSON.parse(orderCall[1].body as string);
        expect(requestBody).toMatchObject({
          eventName: 'Test Event',
          eventDate: '2024-12-31',
          eventTime: '10:00',
          guestCount: 50,
          budget: 1000.00,
          addressId: '1',
          userId: 'test-user-id',
          // specialInstructions can be checked if it was added
        });
      }

      // Check for success message/navigation (adjust based on actual success behavior)
      // Example: Check if a success toast appears (if using a toast library)
      // expect(await screen.findByText(/request submitted successfully/i)).toBeInTheDocument(); 
    });
  });

  it('handles API errors gracefully during submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation(async (url: RequestInfo | URL, options?: RequestInit): Promise<Response | { ok: boolean; json: () => Promise<any> }> => {
      const urlString = url.toString();
      if (urlString.includes('/api/addresses') && options?.method !== 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        });
      }
      if (urlString.includes('/api/orders') && options?.method === 'POST') {
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    });

    await act(async () => {
      render(<CateringOrderForm />);
    });

    const eventNameInput = screen.getByLabelText(/event name/i);
    const eventDateInput = screen.getByLabelText(/event date/i);
    const eventTimeInput = screen.getByLabelText(/event time/i);
    const numberOfGuestsInput = screen.getByLabelText(/number of guests/i);
    const budgetInput = screen.getByLabelText(/budget/i);
    const submitButton = screen.getByRole('button', { name: /submit request/i });

    await act(async () => {
      await user.type(eventNameInput, 'Test Event Error');
      await user.type(eventDateInput, '2024-12-31');
      await user.type(eventTimeInput, '11:00');
      await user.type(numberOfGuestsInput, '20');
      await user.type(budgetInput, '500.00');

      // Simulate address selection via the mocked component's prop
      mockHandleAddressSelect('1');

      await user.click(submitButton);
    });

    // Add assertions for error display if applicable
    // await waitFor(() => { expect(screen.getByText(/failed to submit/i)).toBeInTheDocument(); });
  });

  it('displays an error message on submission failure', async () => {
    const user = userEvent.setup();
    // Mock fetch to simulate a failure
    mockFetch.mockImplementation(async (url: RequestInfo | URL, options?: RequestInit): Promise<Response | { ok: boolean; json: () => Promise<any> }> => {
      const urlString = url.toString();
      if (urlString.includes('/api/addresses') && options?.method !== 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        });
      }
      if (urlString.includes('/api/orders') && options?.method === 'POST') {
        return new Response(JSON.stringify({ message: 'Failed to create order' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    });

    await act(async () => {
      render(<CateringOrderForm />);
    });
    
    const eventNameInput = screen.getByLabelText(/event name/i);
    await act(async () => {
      // Fill form...
      await user.type(eventNameInput, 'Test Event Error');
      await user.type(screen.getByLabelText(/event date/i), '2024-12-31');
      await user.type(screen.getByLabelText(/event time/i), '11:00');
      await user.type(screen.getByLabelText(/number of guests/i), '30');
      await user.type(screen.getByLabelText(/budget/i), '750.00');
      
      // Simulate address selection via the mocked component's prop
      mockHandleAddressSelect('1');
      
      await user.click(screen.getByRole('button', { name: /submit request/i }));
    });

    // Check for error message display (adjust based on how errors are shown)
    await waitFor(() => {
      // Example: Assuming error message is displayed near the form
      expect(screen.getByText(/failed to create order/i)).toBeInTheDocument(); 
      // Or if using react-toastify:
      // expect(await screen.findByRole('alert')).toHaveTextContent(/failed to create order/i);
    });
  });
}); 