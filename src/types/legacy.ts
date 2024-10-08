export type IRootObject = IRootObjectItem[];

export interface IRootObjectItem {
    type: string;
    version?: string;
    comment?: string;
    name?: string;
    database?: string;
    data?: LegacyData[];
}

export interface LegacyData {
    id: string;
    user_id?: string;
    county?: string;
    vendor?: string | null;
    street1: string | null;
    street2?: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    location_number?: string | null;
    parking_loading?: string | null;
    status?: string;
    created_at: string | null;
    updated_at: string | null;
    aid?: string;
    guid?: string;
    address_id?: string;
    brokerage?: string;
    order_number?: string;
    date?: string;
    pickup_time?: string;
    arrival_time?: string;
    complete_time?: string | null;
    headcount?: string;
    need_host?: string;
    hours_needed?: string | null;
    number_of_host?: string;
    client_attention?: string;
    address?: string;
    pickup_notes?: string | null;
    special_notes?: string | null;
    image?: string | null;
    order_total?: string;
    tip?: null | string;
    user_type?: string;
    service_id?: string;
    service_type?: string;
    driver_id?: string;
    item_delivered?: string;
    vehicle_type?: string;
    length?: string | null;
    width?: string | null;
    height?: string | null;
    weight?: string | null;
    type?: string;
    company_name: string | null;
    contact_name?: string;
    contact_number: null | string;
    email?: string;
    password?: string;
    website: null | string;
    counties: null | string;
    time_needed: null | string;
    catering_brokerage: null | string;
    frequency: null | string;
    provide: null | string;
    head_count: null | string;
    photo_vehicle: null | string;
    photo_license: null | string;
    photo_insurance: null | string;
    side_notes: null | string;
    confirmation_code: null | string;
    email_verified_at?: null;
    remember_token?: null;
}
