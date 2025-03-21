// src/types/address.ts

/**
 * Address entity interface
 */
export interface Address {
    id: string;
    county: string | null;
    street1: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    locationNumber: string | null;
    parkingLoading: string | null;
    name: string | null;
    isRestaurant: boolean;
    isShared: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
  }
  
  /**
   * Form data for creating or updating an address
   */
  export interface AddressFormData {
    county: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    locationNumber?: string | null;
    parkingLoading?: string | null;
    name?: string | null;
    isRestaurant: boolean;
    isShared: boolean;
  }
  
  /**
   * User-Address relation interface
   */
  export interface UserAddress {
    id: string;
    userId: string;
    addressId: string;
    alias?: string | null;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    address: Address;
  }
  
  /**
   * Address filter options for API queries
   */
  export interface AddressFilterOptions {
    includePrivate?: boolean;
    includeShared?: boolean;
    isRestaurant?: boolean;
    county?: string;
  }

  