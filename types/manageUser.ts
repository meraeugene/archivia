export type ManageUser = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  full_name: string;
  email: string;
};

export type EditUserData = {
  user_id: string;
  password: string;
  full_name: string;
  email: string;
  role: string;
};
