export interface UserSession {
  id: string;
  user_id: string;
  device: string;
  device_type: string;
  ip_address: string;
  location: string;
  last_active: string;
  user_agent: string;
  is_current: boolean;
}
