// src/lib/services/caterValleyService.ts

// Define allowed status values based on the CaterValley documentation
const CATER_VALLEY_ALLOWED_STATUSES = [
  'CONFIRM',
  'READY',
  'ON_THE_WAY',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
] as const; // Use 'as const' for stricter type checking

// Type for the allowed CaterValley statuses
export type CaterValleyOrderStatus = (typeof CATER_VALLEY_ALLOWED_STATUSES)[number];

// Interface for the response from the CaterValley API
interface CaterValleyApiResponse {
  result: boolean;
  message: string;
  data: Record<string, never>; // Empty object based on docs
}

/**
 * Updates the order status in the CaterValley system via their API.
 *
 * @param orderNumber - The order number recognized by CaterValley.
 * @param status - The new status to set, must be a valid CaterValleyOrderStatus.
 * @returns A promise that resolves with the CaterValley API response.
 * @throws An error if the API call fails or validation fails.
 */
export async function updateCaterValleyOrderStatus(
  orderNumber: string,
  status: CaterValleyOrderStatus
): Promise<CaterValleyApiResponse> {
  const CATER_VALLEY_API_URL =
    process.env.NEXT_PUBLIC_CATER_VALLEY_API_URL || 'https://api-courier.catervalley.com/api/order/update-order-status';
  const PARTNER_HEADER = process.env.NEXT_PUBLIC_CATER_VALLEY_PARTNER_HEADER || 'ready-set';

  // --- Input Validation ---
  if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
    throw new Error('[CaterValley Service] Invalid orderNumber provided.');
  }
  // Validate against the specific CaterValley statuses
  if (!status || !CATER_VALLEY_ALLOWED_STATUSES.includes(status)) {
    throw new Error(`[CaterValley Service] Invalid status provided: ${status}. Must be one of ${CATER_VALLEY_ALLOWED_STATUSES.join(', ')}.`);
  }
  // Developer Note Check: Once an order is marked as "COMPLETED", its status can no longer be updated.
  // Although the API might handle this, adding a client-side check might prevent unnecessary calls.
  // However, we don't know the *previous* status here easily, so we rely on CaterValley's API to reject it.

  console.log(`[CaterValley Service] Attempting to update order ${orderNumber} to status ${status}`);

  try {
    const response = await fetch(CATER_VALLEY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'partner': PARTNER_HEADER, // Crucial header for CaterValley
        // Add other headers if needed, e.g., Authorization if they implement it later
      },
      body: JSON.stringify({ orderNumber, status }),
      // Consider adding a timeout
      // signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    // --- Response Handling ---
    if (!response.ok) {
      // Attempt to parse error message from CaterValley if available
      let errorMessage = `CaterValley API request failed with status ${response.status}`;
      let errorDetails = {};
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage += `: ${errorBody.message}`;
        }
        errorDetails = errorBody; // Keep the full error body for context
      } catch (parseError) {
        // Ignore if error body isn't valid JSON
        errorMessage += `: ${response.statusText}`;
      }
      console.error(`[CaterValley Service] API Error for order ${orderNumber}:`, { status: response.status, message: errorMessage, details: errorDetails });
      throw new Error(errorMessage);
    }

    const responseData: CaterValleyApiResponse = await response.json();
    console.log(`[CaterValley Service] API Response for order ${orderNumber}:`, responseData);

    // Optional: Add more specific checks based on expected response structure
    if (typeof responseData.result !== 'boolean') {
      console.warn("[CaterValley Service] Response 'result' field has unexpected type:", responseData);
      // Decide if this should be a thrown error or just a warning
      // throw new Error('[CaterValley Service] Received malformed response from API.');
    }

    // Handle logical failure reported by the API
    if (responseData.result === false) {
       console.warn(`[CaterValley Service] API reported logical failure for order ${orderNumber}: ${responseData.message}`);
       // We might still return the response data but let the caller decide how to handle 'result: false'
       // Or throw an error:
       // throw new Error(`[CaterValley Service] Update failed for order ${orderNumber}: ${responseData.message || 'Unknown reason'}`);
    }


    return responseData;

  } catch (error) {
    console.error(`[CaterValley Service] Error calling API for order ${orderNumber}:`, error);
    // Re-throw or handle specific error types
    if (error instanceof Error) {
      // Prepend context for better traceability
      throw new Error(`[CaterValley Service] ${error.message}`);
    }
    throw new Error('[CaterValley Service] An unknown error occurred while updating status.');
  }
}

// Potential future functions:
// export async function getCaterValleyOrderStatus(orderNumber: string) { ... }
// export async function createCaterValleyOrder(orderDetails: any) { ... } 