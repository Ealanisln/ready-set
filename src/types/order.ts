// types.ts
export interface Driver {
    id: string;
    name: string | null;
    email: string | null;
    contact_number: string | null;
  }
  
  export interface Order {
    id: string;
    guid: string | null;
    user_id: string;
    address_id: string;
    delivery_address_id?: string;
    brokerage?: string;
    order_number: string;
    driver_status: string;
    date: string;
    pickup_time: string;
    arrival_time: string;
    complete_time: string;
    headcount?: string;
    need_host?: string;
    hours_needed?: string;
    number_of_host?: string;
    client_attention: string;
    pickup_notes: string;
    special_notes: string;
    image: string | null;
    status: "active" | "assigned" | "cancelled" | "completed";
    order_total: string;
    driver_id?: string;
    driverInfo?: Driver;
    tip: string;
    user: {
      name: string | null;
      email: string | null;
    };
    address: Address;
    delivery_address?: Address;
    dispatch: {
      driver: Driver;
    }[];
    order_type: "catering" | "on_demand";
    item_delivered?: string;
    vehicle_type?: string;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    created_at: string | null;
    updated_at: string | null;
  }

  export type Address = {
    id: number;
    user_id: string;
    county: string | null;
    vendor: string | null;
    street1: string | null;
    street2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    location_number: string | null;
    parking_loading: string | null;
    status: 'active' | 'inactive';
    created_at: Date | null;
    updated_at: Date | null;
  };
  