// API response types

export interface ProfileResponse {
  id: string;
  type: string;
  email: string;
  name: string | null;
  contactName?: string | null;
  image?: string | null;
}

export interface ApiError {
  error: string;
  status?: number;
} 