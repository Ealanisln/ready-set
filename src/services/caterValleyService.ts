// src/services/caterValleyService.ts

// Define allowed status values based on the documentation
export const ALLOWED_STATUSES = [
    'CONFIRM',
    'READY',
    'ON_THE_WAY',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
  ] as const; // Use 'as const' for stricter type checking
  
// Type for the allowed statuses
export type OrderStatus = (typeof ALLOWED_STATUSES)[number];

// Interface for the response from the CaterValley API
export interface CaterValleyApiResponse {
    result: boolean;
    message: string;
    data: Record<string, never>; // Empty object based on docs
}

/**
 * Updates the order status via the CaterValley API.
 * 
 * @param orderNumber - The CaterValley order number.
 * @param status - The new status to set.
 * @returns The response from the CaterValley API.
 * @throws Error if the API call fails or input is invalid.
 */
export async function updateCaterValleyOrderStatus(
    orderNumber: string,
    status: OrderStatus
  ): Promise<CaterValleyApiResponse> {
    const CATER_VALLEY_API_URL =
      'https://api-courier.catervalley.com/api/order/update-order-status';
    // Hardcode the partner header as specified in the CaterValley documentation
    const PARTNER_HEADER = 'ready-set';
  
    // Input validation
    if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
        throw new Error('Invalid orderNumber provided for CaterValley update.');
    }
    if (!status || !ALLOWED_STATUSES.includes(status)) {
        throw new Error(`Invalid status provided for CaterValley update: ${status}. Must be one of ${ALLOWED_STATUSES.join(', ')}.`);
    }
  
    // Ensure status is always uppercase as expected by the API
    const normalizedStatus = status.toUpperCase() as OrderStatus;
    
    console.log(`Attempting to update CaterValley status for order ${orderNumber} to ${normalizedStatus}`);

    try {
      const response = await fetch(CATER_VALLEY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'partner': PARTNER_HEADER, // Crucial header for CaterValley
        },
        body: JSON.stringify({ 
          orderNumber, 
          status: normalizedStatus 
        }),
        // Consider adding a timeout if needed
        // signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });
  
      // Log raw response details for debugging
      const responseText = await response.text(); 
      console.log(`CaterValley API response for ${orderNumber} (${normalizedStatus}): Status ${response.status}, Body: ${responseText}`);

      if (!response.ok) {
        // Attempt to parse error message from CaterValley if available
        let errorMessage = `CaterValley API request failed with status ${response.status}`;
        try {
          // Try parsing the already read text
          const errorBody = JSON.parse(responseText);
          if (errorBody.message) {
              errorMessage += `: ${errorBody.message}`;
          }
        } catch (parseError) { 
          // Use the raw text if JSON parsing fails
          errorMessage += `. Response body: ${responseText}`; 
        }
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      // Parse the successful JSON response from the text
      const responseData: CaterValleyApiResponse = JSON.parse(responseText);
  
      // Optional: Add more specific checks based on expected response structure
      if (typeof responseData.result !== 'boolean') {
          console.warn("CaterValley response 'result' field has unexpected type:", responseData);
          // Decide if this should be a hard error or just a warning
          // throw new Error('Received malformed response from CaterValley API.');
      }

      // Log success or logical failure from CaterValley
      if (responseData.result) {
        console.log(`CaterValley status update successful for order ${orderNumber} to ${normalizedStatus}.`);
      } else {
        console.warn(`CaterValley status update logically failed for order ${orderNumber} to ${normalizedStatus}: ${responseData.message}`);
      }
  
      return responseData;
  
    } catch (error) {
      console.error('Error calling CaterValley API:', error);
      // Re-throw or handle specific error types
      if (error instanceof Error) {
          // Append context for better debugging
          throw new Error(`Failed to update CaterValley order status for ${orderNumber}: ${error.message}`);
      }
      throw new Error(`An unknown error occurred while updating CaterValley order status for ${orderNumber}.`);
    }
}

/**
 * Calculate the delivery fee based on order data
 * @param orderData Order data from CaterValley
 * @returns Calculated delivery fee
 */
export async function calculateDeliveryFee(orderData: any): Promise<number> {
  // Basic pricing logic - can be expanded based on business rules
  let baseFee = 42.50; // Default delivery fee
  
  // Adjust fee based on order subtotal
  if (orderData.priceTotal > 300) {
    baseFee += 10;
  }
  
  // Estimate headcount based on total items
  const estimatedHeadcount = Math.ceil(orderData.totalItem / 1.5);
  if (estimatedHeadcount > 25) {
    baseFee += 15;
  }
  
  return baseFee;
}

/**
 * Maps internal driver status to CaterValley status
 * @param driverStatus Our internal driver status
 * @returns CaterValley status
 */
export function mapDriverStatusToCaterValley(driverStatus: string): OrderStatus {
  switch (driverStatus) {
    case 'ASSIGNED':
      return 'CONFIRM';
    
    case 'ARRIVED_AT_VENDOR':
      return 'READY';
    
    case 'EN_ROUTE_TO_CLIENT':
      return 'ON_THE_WAY';
    
    case 'ARRIVED_TO_CLIENT':
    case 'COMPLETED':
      return 'COMPLETED';
    
    default:
      throw new Error(`Unsupported driver status mapping: ${driverStatus}`);
  }
}

/**
 * Maps CaterValley status to our internal driver status
 * @param caterValleyStatus CaterValley API status
 * @returns Our internal driver status
 */
export function mapCaterValleyStatusToDriverStatus(caterValleyStatus: OrderStatus): string {
  switch (caterValleyStatus) {
    case 'CONFIRM':
      return 'ASSIGNED';
    
    case 'READY':
      return 'ARRIVED_AT_VENDOR';
    
    case 'ON_THE_WAY':
      return 'EN_ROUTE_TO_CLIENT';
    
    case 'COMPLETED':
      return 'COMPLETED';
    
    case 'CANCELLED':
      return 'CANCELLED';
    
    case 'REFUNDED':
      return 'CANCELLED'; // Map to the closest matching status
    
    default:
      throw new Error(`Unsupported CaterValley status mapping: ${caterValleyStatus}`);
  }
}
