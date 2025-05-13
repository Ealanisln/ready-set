import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientDashboardError, trackClientDashboardError } from '@/utils/domain-error-tracking';

// Dashboard request schema for validation
const dashboardRequestSchema = z.object({
  clientId: z.string().uuid(),
  dashboardType: z.enum(['ORDERS', 'PERFORMANCE', 'DRIVERS', 'ANALYTICS', 'FINANCE']),
  timeRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  filters: z.record(z.string(), z.any()).optional(),
  aggregation: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']).optional(),
  includeDetails: z.boolean().default(false)
});

type DashboardRequest = z.infer<typeof dashboardRequestSchema>;

/**
 * Function to validate date range is within reasonable limits
 */
function validateDateRange(start: string, end: string): { valid: boolean; message?: string } {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();
  
  // Ensure start is before end
  if (startDate > endDate) {
    return {
      valid: false,
      message: 'Start date must be before end date'
    };
  }
  
  // Ensure date range is not in the future
  if (endDate > now) {
    return {
      valid: false,
      message: 'End date cannot be in the future'
    };
  }
  
  // Ensure range is not too large (e.g., > 1 year)
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
  if (endDate.getTime() - startDate.getTime() > oneYearInMs) {
    return {
      valid: false,
      message: 'Date range cannot exceed 1 year'
    };
  }
  
  return { valid: true };
}

/**
 * Mock function to fetch analytics data for client dashboard
 */
async function fetchDashboardData(
  request: DashboardRequest
): Promise<{ 
  success: boolean; 
  data?: any; 
  error?: string;
  responseTimeMs?: number;
}> {
  const startTime = Date.now();
  
  try {
    // Simulate data processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Simulate random server errors (8% chance)
    if (Math.random() < 0.08) {
      const errors = [
        'Database connection timeout',
        'Query execution error',
        'Data aggregation failed',
        'Resource limit exceeded'
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      
      return {
        success: false,
        error: randomError,
        responseTimeMs: Date.now() - startTime
      };
    }
    
    // Generate mock dashboard data based on request type
    let data: any;
    
    switch (request.dashboardType) {
      case 'ORDERS':
        data = generateMockOrderData(request);
        break;
      case 'PERFORMANCE':
        data = generateMockPerformanceData(request);
        break;
      case 'DRIVERS':
        data = generateMockDriverData(request);
        break;
      case 'ANALYTICS':
        data = generateMockAnalyticsData(request);
        break;
      case 'FINANCE':
        data = generateMockFinanceData(request);
        break;
    }
    
    return {
      success: true,
      data,
      responseTimeMs: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      responseTimeMs: Date.now() - startTime
    };
  }
}

/**
 * Helper functions to generate mock data
 */
function generateMockOrderData(request: DashboardRequest) {
  // Create mock order data
  return {
    summary: {
      totalOrders: Math.floor(Math.random() * 1000) + 100,
      completedOrders: Math.floor(Math.random() * 900) + 50,
      canceledOrders: Math.floor(Math.random() * 50),
      averageOrderValue: Math.floor(Math.random() * 100) + 20,
    },
    trends: Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      orders: Math.floor(Math.random() * 100) + 10,
      value: Math.floor(Math.random() * 1000) + 500,
    })),
    details: request.includeDetails ? Array.from({ length: 20 }).map((_, i) => ({
      id: `order_${Math.floor(Math.random() * 10000)}`,
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      customer: `Customer ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20,
      status: ['completed', 'in_progress', 'canceled'][Math.floor(Math.random() * 3)],
    })) : undefined
  };
}

function generateMockPerformanceData(request: DashboardRequest) {
  // Create mock performance data
  return {
    summary: {
      onTimeDelivery: Math.floor(Math.random() * 20) + 80, // percentage
      averageDeliveryTime: Math.floor(Math.random() * 20) + 20, // minutes
      customerSatisfaction: Math.floor(Math.random() * 10) + 90, // percentage
      repeatCustomers: Math.floor(Math.random() * 20) + 30, // percentage
    },
    trends: Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      onTimeDelivery: Math.floor(Math.random() * 20) + 80,
      averageDeliveryTime: Math.floor(Math.random() * 20) + 20,
      customerSatisfaction: Math.floor(Math.random() * 10) + 90,
    })),
    details: request.includeDetails ? {
      delayReasons: [
        { reason: 'Traffic', count: Math.floor(Math.random() * 50) + 10 },
        { reason: 'Weather', count: Math.floor(Math.random() * 30) + 5 },
        { reason: 'Restaurant Delays', count: Math.floor(Math.random() * 40) + 15 },
        { reason: 'Driver Availability', count: Math.floor(Math.random() * 20) + 8 },
      ]
    } : undefined
  };
}

function generateMockDriverData(request: DashboardRequest) {
  // Create mock driver data
  return {
    summary: {
      totalDrivers: Math.floor(Math.random() * 50) + 20,
      activeDrivers: Math.floor(Math.random() * 30) + 10,
      averageDeliveriesPerDriver: Math.floor(Math.random() * 10) + 5,
      topPerformer: `Driver ${Math.floor(Math.random() * 20) + 1}`,
    },
    trends: Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      activeDrivers: Math.floor(Math.random() * 10) + 15,
      deliveriesCompleted: Math.floor(Math.random() * 100) + 50,
    })),
    details: request.includeDetails ? Array.from({ length: 10 }).map((_, i) => ({
      id: `driver_${Math.floor(Math.random() * 1000)}`,
      name: `Driver ${i + 1}`,
      deliveries: Math.floor(Math.random() * 100) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1),
      onTimePercentage: Math.floor(Math.random() * 20) + 80,
    })) : undefined
  };
}

function generateMockAnalyticsData(request: DashboardRequest) {
  // Create mock analytics data
  return {
    summary: {
      topDeliveryZones: [
        { zone: 'Downtown', count: Math.floor(Math.random() * 500) + 200 },
        { zone: 'Westside', count: Math.floor(Math.random() * 400) + 150 },
        { zone: 'Uptown', count: Math.floor(Math.random() * 300) + 100 },
      ],
      peakHours: [
        { hour: '11:00-13:00', orders: Math.floor(Math.random() * 300) + 200 },
        { hour: '18:00-20:00', orders: Math.floor(Math.random() * 400) + 300 },
      ],
      popularItems: [
        { item: 'Item 1', count: Math.floor(Math.random() * 200) + 100 },
        { item: 'Item 2', count: Math.floor(Math.random() * 150) + 80 },
        { item: 'Item 3', count: Math.floor(Math.random() * 100) + 60 },
      ],
    },
    trends: Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      orders: Math.floor(Math.random() * 100) + 50,
      newCustomers: Math.floor(Math.random() * 20) + 5,
    })),
    details: request.includeDetails ? {
      customerDemographics: {
        age: [
          { range: '18-24', percentage: Math.floor(Math.random() * 20) + 10 },
          { range: '25-34', percentage: Math.floor(Math.random() * 30) + 20 },
          { range: '35-44', percentage: Math.floor(Math.random() * 20) + 15 },
          { range: '45+', percentage: Math.floor(Math.random() * 20) + 5 },
        ],
        orderFrequency: [
          { frequency: 'Weekly', percentage: Math.floor(Math.random() * 30) + 10 },
          { frequency: 'Monthly', percentage: Math.floor(Math.random() * 40) + 30 },
          { frequency: 'Quarterly', percentage: Math.floor(Math.random() * 20) + 10 },
        ]
      }
    } : undefined
  };
}

function generateMockFinanceData(request: DashboardRequest) {
  // Create mock finance data
  return {
    summary: {
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      costs: Math.floor(Math.random() * 30000) + 5000,
      profit: Math.floor(Math.random() * 20000) + 5000,
      profitMargin: Math.floor(Math.random() * 30) + 10, // percentage
    },
    trends: Array.from({ length: 10 }).map((_, i) => ({
      date: new Date(Date.parse(request.timeRange.start) + i * 24 * 60 * 60 * 1000).toISOString(),
      revenue: Math.floor(Math.random() * 5000) + 1000,
      costs: Math.floor(Math.random() * 3000) + 500,
      profit: Math.floor(Math.random() * 2000) + 500,
    })),
    details: request.includeDetails ? {
      costBreakdown: [
        { category: 'Driver Payments', amount: Math.floor(Math.random() * 15000) + 5000 },
        { category: 'Platform Fees', amount: Math.floor(Math.random() * 5000) + 1000 },
        { category: 'Marketing', amount: Math.floor(Math.random() * 8000) + 2000 },
        { category: 'Support', amount: Math.floor(Math.random() * 3000) + 500 },
      ],
      revenueByServiceType: [
        { type: 'Standard Delivery', amount: Math.floor(Math.random() * 30000) + 8000 },
        { type: 'Express Delivery', amount: Math.floor(Math.random() * 15000) + 3000 },
        { type: 'Scheduled Delivery', amount: Math.floor(Math.random() * 10000) + 2000 },
      ]
    } : undefined
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let endpoint = '';
  let clientId = '';
  
  try {
    // Parse request body
    const body = await req.json();
    endpoint = `dashboard/${body.dashboardType || 'unknown'}`;
    clientId = body.clientId;
    
    // Validate with Zod schema
    const requestResult = dashboardRequestSchema.safeParse(body);
    
    if (!requestResult.success) {
      // Extract validation errors from Zod
      const validationErrors = requestResult.error.format();
      
      // Create error with context for tracking
      const error = new ClientDashboardError(
        'Dashboard request validation failed',
        'DATA_FETCHING_ERROR',
        {
          clientId: body.clientId || 'unknown',
          dashboardType: body.dashboardType || 'unknown',
          endpoint,
          filterParams: body.filters,
          responseTimeMs: Date.now() - startTime
        }
      );
      
      // Track the error with Highlight.io
      trackClientDashboardError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Dashboard request validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const dashboardRequest = requestResult.data;
    
    // Validate date range
    const dateValidation = validateDateRange(
      dashboardRequest.timeRange.start,
      dashboardRequest.timeRange.end
    );
    
    if (!dateValidation.valid) {
      const error = new ClientDashboardError(
        dateValidation.message || 'Invalid date range',
        'FILTER_SEARCH_ERROR',
        {
          clientId: dashboardRequest.clientId,
          dashboardType: dashboardRequest.dashboardType,
          timeRange: dashboardRequest.timeRange,
          endpoint,
          responseTimeMs: Date.now() - startTime
        }
      );
      
      trackClientDashboardError(error, error.type, error.context);
      
      return NextResponse.json({
        error: dateValidation.message
      }, { status: 400 });
    }
    
    // Set timeout to detect long-running requests
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timeout: true,
          responseTimeMs: Date.now() - startTime
        });
      }, 5000); // 5 second timeout
    });
    
    // Fetch dashboard data
    const dataPromise = fetchDashboardData(dashboardRequest);
    
    // Race between data fetching and timeout
    const result: any = await Promise.race([dataPromise, timeoutPromise]);
    
    // Check if request timed out
    if (result.timeout) {
      const error = new ClientDashboardError(
        'Dashboard data fetching timeout',
        'DASHBOARD_LOADING_TIMEOUT',
        {
          clientId: dashboardRequest.clientId,
          dashboardType: dashboardRequest.dashboardType,
          endpoint,
          responseTimeMs: result.responseTimeMs
        }
      );
      
      trackClientDashboardError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Dashboard data fetching timed out'
      }, { status: 504 });
    }
    
    // Check if data fetching succeeded
    if (!result.success) {
      const error = new ClientDashboardError(
        result.error || 'Failed to fetch dashboard data',
        'DATA_FETCHING_ERROR',
        {
          clientId: dashboardRequest.clientId,
          dashboardType: dashboardRequest.dashboardType,
          endpoint,
          responseTimeMs: result.responseTimeMs
        }
      );
      
      trackClientDashboardError(error, error.type, error.context);
      
      return NextResponse.json({
        error: result.error || 'Failed to fetch dashboard data'
      }, { status: 500 });
    }
    
    // Log if response time is slow but not timing out
    if (result.responseTimeMs > 2000) {
      const slowResponse = new ClientDashboardError(
        'Slow dashboard data response',
        'DASHBOARD_LOADING_TIMEOUT', // Using this type for slow responses too
        {
          clientId: dashboardRequest.clientId,
          dashboardType: dashboardRequest.dashboardType,
          endpoint,
          responseTimeMs: result.responseTimeMs
        }
      );
      
      trackClientDashboardError(slowResponse, slowResponse.type, slowResponse.context);
      // Don't return an error for slow responses, just track them
    }
    
    // Return successful response
    return NextResponse.json({
      success: true,
      dashboardType: dashboardRequest.dashboardType,
      timeRange: dashboardRequest.timeRange,
      data: result.data,
      responseTimeMs: result.responseTimeMs
    });
    
  } catch (error) {
    // Handle unexpected errors
    const responseTimeMs = Date.now() - startTime;
    console.error('Unexpected error in client dashboard:', error);
    
    const unexpectedError = new ClientDashboardError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'DATA_FETCHING_ERROR',
      {
        clientId: clientId || 'unknown',
        dashboardType: 'unknown',
        endpoint,
        responseTimeMs
      }
    );
    
    trackClientDashboardError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching dashboard data'
    }, { status: 500 });
  }
} 