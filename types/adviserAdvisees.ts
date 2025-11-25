export interface Advisee {
  student_id: string;
  student_name: string;
  status:
    | "pending"
    | "accepted"
    | "already_handled"
    | "referred"
    | "reserved"
    | "returned";
  title: string;
  created_at: string; // ISO timestamp
  abstract: string;
  student_email: string;
  student_profile: string;
  student_section: string;
  student_year: string;
  thesis_url: string;
}

export type AdviserWithAdvisees = {
  adviser_id: string;
  adviser_name: string;
  adviser_email: string | null;
  total_advisees: number;
  advisees: Advisee[] | null; // null if none (because of json_agg)
  max_limit: number;
  profile_picture: string | null;
  total_accepted: number;
  total_pending: number;
};
