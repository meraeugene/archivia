export type Request = {
  id: string;
  adviser_id: string;
  student_id: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "already_handled"
    | "referred"
    | "reserved"
    | "returned";
  submitted_at: string;
  student_user_id: string;
  student_name: string;
  student_email: string;
  student_profile_picture: string | null;
  title: string;
  abstract: string;
  feedback: string | null;
  referred_to: string | null;
  referred_by: string | null;
  thesis_url: string;
  recommended_adviser_ids: string[] | null;
  is_authorized: boolean;
};
