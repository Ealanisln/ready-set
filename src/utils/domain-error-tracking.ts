import { H } from 'highlight.run';
import { logError } from './error-logging';

// Define ErrorSource type to match what's expected
export type ErrorSource = 
  | 'client' 
  | 'server' 
  | 'api:order-management'
  | 'api:dispatch-system'
  | 'api:other';

// Domain-specific error types
export type OrderErrorType = 
  | 'ORDER_CREATION_FAILED'
  | 'STATUS_UPDATE_FAILED'
  | 'DRIVER_ASSIGNMENT_FAILED'
  | 'VALIDATION_ERROR'
  | 'PRICING_CALCULATION_ERROR'
  | 'SCHEDULING_CONFLICT';

export type DispatchErrorType =
  | 'DRIVER_ASSIGNMENT_FAILED'
  | 'STATUS_UPDATE_FAILED'
  | 'LOCATION_TRACKING_ERROR'
  | 'ETA_CALCULATION_ERROR'
  | 'DELIVERY_COMPLETION_ERROR'
  | 'DRIVER_NOTIFICATION_ERROR';

export type AddressErrorType =
  | 'ADDRESS_VALIDATION_FAILED'
  | 'GEOCODING_FAILED'
  | 'ADDRESS_CREATION_FAILED'
  | 'ADDRESS_UPDATE_FAILED'
  | 'ADDRESS_ASSOCIATION_ERROR'
  | 'ADDRESS_DELETE_CONSTRAINT_VIOLATION';

export type FileUploadErrorType =
  | 'UPLOAD_SIZE_LIMIT_EXCEEDED'
  | 'INVALID_FILE_FORMAT'
  | 'STORAGE_ERROR'
  | 'ENTITY_ASSOCIATION_ERROR'
  | 'FILE_DELETION_ERROR'
  | 'FILE_PERMISSION_ERROR';

export type ProfileErrorType =
  | 'PROFILE_UPDATE_FAILED'
  | 'PASSWORD_CHANGE_FAILED'
  | 'EMAIL_UPDATE_VALIDATION_ERROR'
  | 'ACCOUNT_DEACTIVATION_ERROR'
  | 'PROFILE_IMAGE_UPLOAD_ERROR'
  | 'COMPANY_INFO_UPDATE_ERROR';

export type JobApplicationErrorType =
  | 'APPLICATION_SUBMISSION_FAILED'
  | 'DOCUMENT_UPLOAD_FAILED'
  | 'STATUS_UPDATE_ERROR'
  | 'FORM_VALIDATION_ERROR'
  | 'CONVERT_TO_DRIVER_ERROR';

export type ClientDashboardErrorType =
  | 'DATA_FETCHING_ERROR'
  | 'DASHBOARD_LOADING_TIMEOUT'
  | 'FILTER_SEARCH_ERROR'
  | 'DATA_AGGREGATION_ERROR';

export type AdminOperationsErrorType =
  | 'PERMISSION_ERROR'
  | 'REPORT_GENERATION_FAILURE'
  | 'BULK_OPERATION_ERROR'
  | 'SETTINGS_UPDATE_ERROR'
  | 'ADMIN_ACTION_AUDIT_FAILURE';

// Error context interfaces
export interface OrderErrorContext {
  orderId?: string;
  customerId?: string;
  orderType?: string;
  attemptedAction?: string;
  validationErrors?: Record<string, unknown>;
  pricing?: {
    calculatedAmount?: number;
    currency?: string;
  };
}

export interface DispatchErrorContext {
  dispatchId?: string;
  driverId?: string;
  orderId?: string;
  location?: {
    lat?: number;
    lng?: number;
  };
  deliveryStatus?: string;
  notificationDetails?: {
    type: string;
    recipient: string;
  };
}

export interface AddressErrorContext {
  addressId?: string;
  userId?: string;
  orderId?: string;
  addressData?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  geocodeData?: {
    lat?: number;
    lng?: number;
  };
  validationErrors?: Record<string, unknown>;
}

export interface FileUploadErrorContext {
  fileId?: string;
  userId?: string;
  entityId?: string;
  entityType?: string;
  fileType?: string;
  fileSize?: number;
  fileName?: string;
  errorDetails?: {
    code?: string;
    message?: string;
  };
}

export interface ProfileErrorContext {
  userId?: string;
  email?: string;
  attemptedAction?: string;
  validationErrors?: Record<string, unknown>;
  companyId?: string;
  imageId?: string;
}

export interface JobApplicationErrorContext {
  applicationId?: string;
  userId?: string;
  documentIds?: string[];
  status?: string;
  validationErrors?: Record<string, unknown>;
  attemptedAction?: string;
  jobPosition?: string;
  location?: string;
}

export interface ClientDashboardErrorContext {
  clientId?: string;
  dashboardType?: string;
  timeRange?: {
    start?: string;
    end?: string;
  };
  filterParams?: Record<string, unknown>;
  endpoint?: string;
  responseTimeMs?: number;
}

export interface AdminOperationsErrorContext {
  adminId?: string;
  targetResourceType?: string;
  targetResourceId?: string;
  action?: string;
  affectedItems?: number;
  permissionLevel?: string;
  settingsModule?: string;
  reportType?: string;
  errorDetails?: {
    code?: string;
    message?: string;
  };
}

// Order Management error tracking
export function trackOrderError(
  error: Error,
  type: OrderErrorType,
  context: OrderErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'order-management',
    orderId: context.orderId || 'unknown',
    customerId: context.customerId || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Order Management Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'order-management',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('order_management_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// Dispatch System error tracking
export function trackDispatchError(
  error: Error,
  type: DispatchErrorType,
  context: DispatchErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'dispatch-system',
    dispatchId: context.dispatchId || 'unknown',
    driverId: context.driverId || 'unknown',
    orderId: context.orderId || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Dispatch System Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'dispatch-system',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('dispatch_system_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// Address Management error tracking
export function trackAddressError(
  error: Error,
  type: AddressErrorType,
  context: AddressErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'address-management',
    addressId: context.addressId || 'unknown',
    userId: context.userId || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Address Management Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'address-management',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('address_management_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// File Upload error tracking
export function trackFileUploadError(
  error: Error,
  type: FileUploadErrorType,
  context: FileUploadErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'file-upload-system',
    fileId: context.fileId || 'unknown',
    userId: context.userId || 'unknown',
    fileType: context.fileType || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `File Upload Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'file-upload-system',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('file_upload_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// User Profile error tracking
export function trackProfileError(
  error: Error,
  type: ProfileErrorType,
  context: ProfileErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'profile-management',
    userId: context.userId || 'unknown',
    attemptedAction: context.attemptedAction || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Profile Management Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'profile-management',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('profile_management_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// Job Application error tracking
export function trackJobApplicationError(
  error: Error,
  type: JobApplicationErrorType,
  context: JobApplicationErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'job-application-system',
    applicationId: context.applicationId || 'unknown',
    userId: context.userId || 'unknown',
    attemptedAction: context.attemptedAction || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Job Application Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'job-application-system',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('job_application_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// Client Dashboard error tracking
export function trackClientDashboardError(
  error: Error,
  type: ClientDashboardErrorType,
  context: ClientDashboardErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'client-dashboard',
    clientId: context.clientId || 'unknown',
    dashboardType: context.dashboardType || 'unknown',
    endpoint: context.endpoint || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Client Dashboard Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'client-dashboard',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('client_dashboard_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    responseTimeMs: context.responseTimeMs,
    ...context,
  });
}

// Admin Operations error tracking
export function trackAdminOperationsError(
  error: Error,
  type: AdminOperationsErrorType,
  context: AdminOperationsErrorContext
) {
  // Log to Highlight.io - passing the error directly
  H.consumeError(error);
  
  // Add tags with a separate track event for categorization
  H.track('highlight_error_metadata', {
    errorType: type,
    domain: 'admin-operations',
    adminId: context.adminId || 'unknown',
    action: context.action || 'unknown',
    targetResourceType: context.targetResourceType || 'unknown',
  });

  // Log to our error logging system
  logError(error, {
    message: `Admin Operations Error: ${type}`,
    source: 'api:other',
    additionalContext: {
      domain: 'admin-operations',
      errorType: type,
      ...context,
    },
  });

  // Track as custom event for analytics
  H.track('admin_operations_error', {
    errorType: type,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

// Custom error classes for better error handling
export class OrderManagementError extends Error {
  constructor(
    message: string,
    public type: OrderErrorType,
    public context: OrderErrorContext
  ) {
    super(message);
    this.name = 'OrderManagementError';
  }
}

export class DispatchSystemError extends Error {
  constructor(
    message: string,
    public type: DispatchErrorType,
    public context: DispatchErrorContext
  ) {
    super(message);
    this.name = 'DispatchSystemError';
  }
}

export class AddressManagementError extends Error {
  constructor(
    message: string,
    public type: AddressErrorType,
    public context: AddressErrorContext
  ) {
    super(message);
    this.name = 'AddressManagementError';
  }
}

export class FileUploadError extends Error {
  constructor(
    message: string,
    public type: FileUploadErrorType,
    public context: FileUploadErrorContext
  ) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export class ProfileManagementError extends Error {
  constructor(
    message: string,
    public type: ProfileErrorType,
    public context: ProfileErrorContext
  ) {
    super(message);
    this.name = 'ProfileManagementError';
  }
}

export class JobApplicationError extends Error {
  constructor(
    message: string,
    public type: JobApplicationErrorType,
    public context: JobApplicationErrorContext
  ) {
    super(message);
    this.name = 'JobApplicationError';
  }
}

export class ClientDashboardError extends Error {
  constructor(
    message: string,
    public type: ClientDashboardErrorType,
    public context: ClientDashboardErrorContext
  ) {
    super(message);
    this.name = 'ClientDashboardError';
  }
}

export class AdminOperationsError extends Error {
  constructor(
    message: string,
    public type: AdminOperationsErrorType,
    public context: AdminOperationsErrorContext
  ) {
    super(message);
    this.name = 'AdminOperationsError';
  }
} 