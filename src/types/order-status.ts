// Shared enums for order statuses
export enum CateringStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED'
}

export enum OnDemandStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED'
}

// Helper type for combined status
export type OrderStatus = CateringStatus | OnDemandStatus;

// Helper functions to check status types
export const isCateringStatus = (status: string): status is CateringStatus => {
  return Object.values(CateringStatus).includes(status as CateringStatus);
};

export const isOnDemandStatus = (status: string): status is OnDemandStatus => {
  return Object.values(OnDemandStatus).includes(status as OnDemandStatus);
};

// Helper function to get status color classes
export const getStatusColorClasses = (status: OrderStatus): string => {
  switch (status) {
    case CateringStatus.ACTIVE:
    case OnDemandStatus.ACTIVE:
      return "bg-blue-100 text-blue-800";
    case CateringStatus.ASSIGNED:
    case OnDemandStatus.ASSIGNED:
      return "bg-indigo-100 text-indigo-800";
    case CateringStatus.COMPLETED:
    case OnDemandStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case CateringStatus.CANCELLED:
    case OnDemandStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    case CateringStatus.PENDING:
    case OnDemandStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case CateringStatus.CONFIRMED:
    case OnDemandStatus.CONFIRMED:
      return "bg-emerald-100 text-emerald-800";
    case CateringStatus.IN_PROGRESS:
    case OnDemandStatus.IN_PROGRESS:
      return "bg-purple-100 text-purple-800";
    case CateringStatus.DELIVERED:
    case OnDemandStatus.DELIVERED:
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}; 