// src/types/catering.ts

export interface Address {
  id: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  locationNumber?: string | null;
  parkingLoading?: string | null;
  isRestaurant: boolean;
  isShared: boolean;
}

export interface CateringFormData {
  brokerage: string;
  order_number: string;
  address_id: string;
  delivery_address_id: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  complete_time?: string;
  headcount: string;
  need_host: "yes" | "no";
  hours_needed?: string;
  number_of_host?: string;
  client_attention: string;
  pickup_notes?: string;
  special_notes?: string;
  order_total: string;
  tip?: string;
  address: Address;
  delivery_address: Address;
}
