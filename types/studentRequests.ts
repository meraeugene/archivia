export type StudentRequest = {
  id: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  title: string;
  abstract: string;
  feedback: string | null;
  adviser_id: string;
  adviser_user_id: string;
  adviser_name: string;
  adviser_email: string;
  adviser_profile_picture: string | null;
  student_id: string;
  adviser_prefix: string | null;
  adviser_suffix: string | null;
};
