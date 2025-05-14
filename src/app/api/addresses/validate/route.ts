import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AddressManagementError, trackAddressError } from '@/utils/domain-error-tracking';

// Address validation schema
const addressSchema = z.object({
  street: z.string().min(3).max(100),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, {
    message: "Postal code must be in format '12345' or '12345-6789'"
  }),
  country: z.string().min(2).max(50).default('US'),
  unitNumber: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
});

type AddressRequest = z.infer<typeof addressSchema>;

// Define types for API responses
interface ExternalValidationSuccess {
  success: true;
  isValid: boolean;
  standardized: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    unitNumber?: string;
  } | null;
  issues: string[];
}

interface ExternalValidationError {
  success: false;
  error: string;
  code: string;
}

type ExternalValidationResponse = ExternalValidationSuccess | ExternalValidationError;

interface GeocodeSuccess {
  success: true;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GeocodeError {
  success: false;
  error: string;
}

type GeocodeResponse = GeocodeSuccess | GeocodeError;

// Mock function for external address validation API
async function validateWithExternalApi(address: AddressRequest): Promise<ExternalValidationResponse> {
  try {
    // Simulate external API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate random API errors to test error handling
    const randomValue = Math.random();
    
    if (randomValue < 0.1) {
      // Simulate API timeout
      throw new Error('External API timeout');
    } else if (randomValue < 0.2) {
      // Simulate API error response
      return {
        success: false,
        error: 'External service error',
        code: 'EXT_SERVICE_ERROR'
      };
    }
    
    // Validation logic (simplified)
    const isValid = !address.street.includes('Invalid') && 
                   !address.city.includes('Invalid');
    
    return {
      success: true,
      isValid,
      standardized: isValid ? {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        ...(address.unitNumber ? { unitNumber: address.unitNumber } : {})
      } : null,
      issues: isValid ? [] : ['Address not found in database']
    };
  } catch (error) {
    console.error('External API error:', error);
    throw error;
  }
}

// Mock function for geocoding
async function geocodeAddress(address: AddressRequest): Promise<GeocodeResponse> {
  try {
    // Simulate geocoding API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate random geocoding errors
    if (Math.random() < 0.15) {
      throw new Error('Geocoding service unavailable');
    }
    
    // Sample geocoding logic
    // In real implementation, this would call a geocoding service like Google Maps
    return {
      success: true,
      coordinates: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1, // Random around San Francisco
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      }
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const addressResult = addressSchema.safeParse(body);
    
    if (!addressResult.success) {
      // Extract validation errors from Zod
      const validationErrors = addressResult.error.format();
      
      // Create error with context for tracking
      const error = new AddressManagementError(
        'Address validation failed',
        'ADDRESS_VALIDATION_FAILED',
        {
          ...(body.userId ? { userId: body.userId } : {}),
          addressData: {
            street: body.street,
            city: body.city,
            state: body.state,
            postalCode: body.postalCode,
            country: body.country
          },
          validationErrors
        }
      );
      
      // Track the error with Highlight.io
      trackAddressError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Address validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const addressData = addressResult.data;
    
    // Validate with external address validation API
    let externalValidation: ExternalValidationResponse;
    try {
      externalValidation = await validateWithExternalApi(addressData);
      
      if (!externalValidation.success) {
        const error = new AddressManagementError(
          'External address validation service error',
          'ADDRESS_VALIDATION_FAILED',
          {
            ...(addressData.userId ? { userId: addressData.userId } : {}),
            addressData: {
              street: addressData.street,
              city: addressData.city,
              state: addressData.state,
              postalCode: addressData.postalCode,
              country: addressData.country
            },
            validationErrors: {
              externalApiError: externalValidation.error,
              code: externalValidation.code
            }
          }
        );
        
        trackAddressError(error, error.type, error.context);
        
        return NextResponse.json({
          error: 'External validation service error',
          details: externalValidation.error
        }, { status: 502 });
      }
      
      if (!externalValidation.isValid) {
        const error = new AddressManagementError(
          'Address not valid according to external validation',
          'ADDRESS_VALIDATION_FAILED',
          {
            ...(addressData.userId ? { userId: addressData.userId } : {}),
            addressData: {
              street: addressData.street,
              city: addressData.city,
              state: addressData.state,
              postalCode: addressData.postalCode,
              country: addressData.country
            },
            validationErrors: {
              issues: externalValidation.issues
            }
          }
        );
        
        trackAddressError(error, error.type, error.context);
        
        return NextResponse.json({
          valid: false,
          issues: externalValidation.issues
        }, { status: 200 });
      }
    } catch (error) {
      // Handle external API errors
      const apiError = new AddressManagementError(
        error instanceof Error ? error.message : 'External validation API error',
        'ADDRESS_VALIDATION_FAILED',
        {
          ...(addressData.userId ? { userId: addressData.userId } : {}),
          addressData: {
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country
          }
        }
      );
      
      trackAddressError(apiError, apiError.type, apiError.context);
      
      return NextResponse.json({
        error: 'External address validation service error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 502 });
    }
    
    // If address is valid, attempt to geocode
    let geocodeResult: GeocodeResponse;
    try {
      geocodeResult = await geocodeAddress(addressData);
    } catch (error) {
      // Track geocoding error but don't fail the request entirely
      const geocodeError = new AddressManagementError(
        error instanceof Error ? error.message : 'Geocoding failed',
        'GEOCODING_FAILED',
        {
          ...(addressData.userId ? { userId: addressData.userId } : {}),
          addressData: {
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country
          }
        }
      );
      
      trackAddressError(geocodeError, geocodeError.type, geocodeError.context);
      
      // Continue with the response, just without geocode data
      geocodeResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Geocoding failed'
      };
    }
    
    // Return successful validation response
    return NextResponse.json({
      valid: true,
      standardized: externalValidation.standardized,
      geocode: geocodeResult.success ? geocodeResult.coordinates : null,
      geocodeError: !geocodeResult.success ? geocodeResult.error : null
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in address validation:', error);
    
    // Create and track error
    const unexpectedError = new AddressManagementError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'ADDRESS_VALIDATION_FAILED',
      {
        addressData: {
          street: 'unknown',
          city: 'unknown',
          state: 'unknown',
          postalCode: 'unknown',
          country: 'unknown'
        }
      }
    );
    
    trackAddressError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred during address validation'
    }, { status: 500 });
  }
} 