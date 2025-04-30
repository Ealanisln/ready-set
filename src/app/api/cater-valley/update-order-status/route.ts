import { type NextRequest, NextResponse } from 'next/server';

// Define allowed status values based on the documentation
const ALLOWED_STATUSES = [
  'CONFIRM',
  'READY',
  'ON_THE_WAY',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
] as const; // Use 'as const' for stricter type checking

// Type for the allowed statuses
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

// Interface for the request body expected by this route handler
interface UpdateStatusRequestBody {
  orderNumber: string;
  status: OrderStatus;
  // Add any other internal identifiers if needed, e.g., your internal order ID
  // internalOrderId?: string;
}

// Interface for the response from the CaterValley API
interface CaterValleyApiResponse {
  result: boolean;
  message: string;
  data: Record<string, never>; // Empty object based on docs
}

// --- Service Function for API Call (Good Practice) ---
// It's good practice to potentially move this to a separate service file
// e.g., services/caterValleyService.ts

async function updateCaterValleyOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<CaterValleyApiResponse> {
  const CATER_VALLEY_API_URL =
    'https://api-courier.catervalley.com/api/order/update-order-status';
  const PARTNER_HEADER = 'ready-set'; // As required by CaterValley

  // Input validation
  if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
      throw new Error('Invalid orderNumber provided.');
  }
  if (!status || !ALLOWED_STATUSES.includes(status)) {
      throw new Error(`Invalid status provided: ${status}. Must be one of ${ALLOWED_STATUSES.join(', ')}.`);
  }

  try {
    const response = await fetch(CATER_VALLEY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        partner: PARTNER_HEADER, // Crucial header for CaterValley
      },
      body: JSON.stringify({ orderNumber, status }),
      // Consider adding a timeout if needed
      // signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });

    if (!response.ok) {
      // Attempt to parse error message from CaterValley if available
      let errorMessage = `CaterValley API request failed with status ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
            errorMessage += `: ${errorBody.message}`;
        }
      } catch (parseError) {
        // Ignore if error body isn't valid JSON
      }
      throw new Error(errorMessage);
    }

    const responseData: CaterValleyApiResponse = await response.json();

    // Optional: Add more specific checks based on expected response structure
    if (typeof responseData.result !== 'boolean') {
        console.warn("CaterValley response 'result' field has unexpected type:", responseData);
        throw new Error('Received malformed response from CaterValley API.');
    }

    return responseData;

  } catch (error) {
    console.error('Error calling CaterValley API:', error);
    // Re-throw or handle specific error types
    if (error instanceof Error) {
        // Append context for better debugging
        throw new Error(`Failed to update CaterValley order status: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating CaterValley order status.');
  }
}

// --- API Route Handler ---

export async function POST(request: NextRequest) {
  try {
    // 1. Parse Request Body
    // Ensure the request content type is application/json before parsing
    if (request.headers.get('content-type') !== 'application/json') {
        return NextResponse.json(
            { message: 'Invalid Content-Type. Expected application/json.' },
            { status: 415 } // Unsupported Media Type
        );
    }

    let requestBody: UpdateStatusRequestBody;
    try {
        requestBody = await request.json();
    } catch (e) {
        return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }


    // 2. Validate Input (Basic validation, add more as needed)
    const { orderNumber, status } = requestBody;
    if (!orderNumber || !status) {
      return NextResponse.json(
        { message: 'Missing required fields: orderNumber and status' },
        { status: 400 } // Bad Request
      );
    }
    if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json(
            { message: `Invalid status: ${status}. Must be one of ${ALLOWED_STATUSES.join(', ')}.` },
            { status: 400 }
        );
    }

    // --- Security Note ---
    // Add authentication/authorization checks here if this endpoint
    // needs to be protected. Verify the caller has permission to update this order.
    // Example: const session = await getServerSession(authOptions); if (!session) { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }


    // 3. Call the External API via the service function
    const caterValleyResponse = await updateCaterValleyOrderStatus(
      orderNumber,
      status
    );

    // 4. Handle External API Response
    if (!caterValleyResponse.result) {
      // The API call was successful, but the operation failed logically according to CaterValley
      console.warn(
        `CaterValley indicated failure for order ${orderNumber}: ${caterValleyResponse.message}`
      );
      // You might want to return a specific status code depending on the failure reason
      return NextResponse.json(
        {
          message: `Failed to update status in CaterValley: ${caterValleyResponse.message}`,
          caterValleyDetails: caterValleyResponse, // Forward details if helpful
        },
        { status: 422 } // Unprocessable Entity - request ok, but couldn't process
      );
    }

    // 5. Optional: Update Your Own Database
    // If the CaterValley update was successful, you likely want to reflect this
    // change in your own application's database.
    /*
    try {
      // Example using a hypothetical db client (e.g., Prisma, Drizzle ORM, node-postgres)
      await db.updateOrder(requestBody.internalOrderId ?? orderNumber, { // Use your internal ID if available
        status: status, // Or map CaterValley status to your internal status system
        lastExternalUpdate: new Date(),
      });
    } catch (dbError) {
      console.error(`Failed to update internal database for order ${orderNumber} after successful CaterValley update:`, dbError);
      // Decide how critical this is. Maybe just log, or return a specific error state?
      // Potentially queue a retry for the DB update.
      return NextResponse.json(
        { message: 'External status updated, but internal update failed. Please check logs.' },
        { status: 500 } // Indicate partial failure
      );
    }
    */

    // 6. Return Success Response
    return NextResponse.json(
      {
        message: 'Order status successfully updated in CaterValley.',
        // Optionally include details from the response if needed by the client
        // caterValleyResponse: caterValleyResponse
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    // Catch errors from input parsing, validation, API call, or DB update
    console.error('Error in /api/cater-valley/update-order-status:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';

    // Return a generic server error response
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Optional: Define types for configuration or other edge cases if needed
// export const dynamic = 'force-dynamic'; // If needed, though default should be fine 