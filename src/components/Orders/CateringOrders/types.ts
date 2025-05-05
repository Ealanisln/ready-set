export type StatusFilter = "all" | "active" | "assigned" | "cancelled" | "completed";

export interface Order {
  id: string;
  order_number: string;
  status: string;
  date: string | Date;
  order_total: number | string;
  client_attention?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string | null;
  };
  pickupAddress?: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    county?: string | null;
  };
  deliveryAddress?: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    county?: string | null;
  };
}

export interface UserRole {
  isAdmin: boolean;
  isSuperAdmin: boolean;
}