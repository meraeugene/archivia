export interface UserSession {
  id: string; // uuid
  user_id: string | null;
  device: string | null;
  device_type: string | null;
  ip_address: string | null;
  location: string | null;
  last_active: string | null; // timestamp with time zone
  user_agent: string | null;
  is_current: boolean | null;
}
