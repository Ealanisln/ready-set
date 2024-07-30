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