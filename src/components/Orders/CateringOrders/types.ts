export interface Order {
    id: string;
    user_id: string;
    order_number: string;
    brokerage?: string;
    status: string;
    date: string;
    order_total: string | number;
    client_attention: string;
  }
  
  export type StatusFilter = "all" | "active" | "completed";