// types/catering.ts
export interface CateringRequest {
  id: bigint;
  user_id: string;
  address_id: bigint;
  brokerage?: string | null;
  order_number?: string | null;
  date?: Date | null;
  pickup_time?: Date | null;
  arrival_time?: Date | null;
  complete_time?: Date | null;
  headcount?: string | null;
  need_host: 'yes' | 'no';
  hours_needed?: string | null;
  number_of_host?: string | null;
  client_attention?: string | null;
  pickup_notes?: string | null;
  special_notes?: string | null;
  image?: string | null;
  status?: 'active' | 'assigned' | 'cancelled' | 'completed' | null;
  order_total?: number | null;
  tip?: number | null;
}

export interface CateringRequestFormData {
  address_id: string; // We'll convert this to bigint when sending to the API
  brokerage?: string;
  order_number?: string;
  date?: string;
  pickup_time?: string;
  arrival_time?: string;
  complete_time?: string;
  headcount?: string;
  need_host: 'yes' | 'no';
  hours_needed?: string;
  number_of_host?: string;
  client_attention?: string;
  pickup_notes?: string;
  special_notes?: string;
}