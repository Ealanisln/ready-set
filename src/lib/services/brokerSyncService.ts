import { Order, OrderStatus, isCateringRequest } from '@/types/order';
import { updateCaterValleyOrderStatus, CaterValleyOrderStatus } from '@/lib/services/caterValleyService';
import toast from 'react-hot-toast';

// --- Configuration for Broker Status Mapping ---

// Example: CaterValley Mapping (as defined before)
const caterValleyStatusMap: Partial<Record<OrderStatus, CaterValleyOrderStatus>> = {
  [OrderStatus.ASSIGNED]: 'CONFIRM',
  [OrderStatus.CANCELLED]: 'CANCELLED',
  [OrderStatus.COMPLETED]: 'COMPLETED',
};

// Add mappings for other brokers here if needed
// const otherBrokerStatusMap: Partial<Record<OrderStatus, OtherBrokerStatusType>> = { ... };


/**
 * Checks the order's broker and syncs the status with the appropriate external service if configured.
 * @param order The order object (must contain broker identification, e.g., brokerage field).
 * @param newStatus The new internal OrderStatus.
 */
export async function syncOrderStatusWithBroker(order: Order, newStatus: OrderStatus): Promise<void> {
  // 1. Determine the broker and required action
  let brokerIdentifier: string | null | undefined = null;
  let requiresSync = false;
  let syncFunction: ((orderNumber: string, status: any) => Promise<any>) | null = null;
  let statusMap: Partial<Record<OrderStatus, any>> | null = null;

  // --- Broker Identification Logic --- 
  // Adapt this based on how brokers are identified in your data
  if (isCateringRequest(order) && order.brokerage) {
      brokerIdentifier = order.brokerage;
      console.log(`Order ${order.orderNumber} has brokerage: ${brokerIdentifier}`);

      // Configure sync based on broker
      if (brokerIdentifier === 'CaterValley') { // Use the specific identifier from your DB
          requiresSync = true;
          syncFunction = updateCaterValleyOrderStatus;
          statusMap = caterValleyStatusMap;
          console.log(`Configured sync for CaterValley.`);
      }
      // --- Add else if blocks for other brokers ---
      // else if (brokerIdentifier === 'BrokerB_Identifier') {
      //     requiresSync = true;
      //     syncFunction = updateBrokerBOrderStatus; // You'd need to create this service
      //     statusMap = brokerBStatusMap;
      //     console.log(`Configured sync for BrokerB.`);
      // }
       else {
         console.log(`No specific sync configuration found for broker: ${brokerIdentifier}`);
       }

  } else {
      console.log(`Order ${order.orderNumber} is not a CateringRequest with a brokerage or has no broker identifier. Skipping sync.`);
      // Handle OnDemand orders here if they can also have brokers/sync requirements
  }
  // --- End Broker Identification ---

  // 2. Execute Sync if Required
  if (requiresSync && syncFunction && statusMap) {
    const brokerStatus = statusMap[newStatus];

    if (brokerStatus) {
      console.log(`Syncing status ${newStatus} -> ${brokerStatus} with ${brokerIdentifier} for order ${order.orderNumber}`);
      try {
        // Call the specific broker's update function
        const brokerResponse = await syncFunction(order.orderNumber, brokerStatus);

        // Handle response generically (assuming a 'result' field, adapt if needed)
        if (brokerResponse && typeof brokerResponse.result === 'boolean') {
            if (brokerResponse.result) {
                console.log(`${brokerIdentifier} status update successful for order ${order.orderNumber}`);
                // Optional success toast: toast.success(`Status synced with ${brokerIdentifier}.`);
            } else {
                const message = brokerResponse.message || 'Reason unknown.';
                console.warn(`${brokerIdentifier} update failed logically for order ${order.orderNumber}: ${message}`);
                toast(`Warning: Internal status updated, but ${brokerIdentifier} sync failed: ${message}`, { duration: 5000 });
            }
        } else {
             console.warn(`Received unexpected response structure from ${brokerIdentifier} for order ${order.orderNumber}`, brokerResponse);
             toast(`Status synced with ${brokerIdentifier}, but response format was unexpected.`, { duration: 4000 });
        }

      } catch (brokerError) {
        console.error(`Error syncing status with ${brokerIdentifier} for order ${order.orderNumber}:`, brokerError);
        toast.error(brokerError instanceof Error
          ? `Internal status updated, but ${brokerIdentifier} sync failed: ${brokerError.message}`
          : `Internal status updated, but failed to sync with ${brokerIdentifier}.`);
      }
    } else {
      console.log(`No status mapping found for broker ${brokerIdentifier} and internal status ${newStatus}. Skipping sync.`);
    }
  } else if (requiresSync) {
      console.warn(`Sync was required for broker ${brokerIdentifier} but configuration (syncFunction or statusMap) was missing.`);
  }
} 