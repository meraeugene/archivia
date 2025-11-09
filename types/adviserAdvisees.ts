export interface Advisee {
  student_id: string;
  student_name: string | null;
  status:
    | "pending"
    | "accepted"
    | "already_handled"
    | "referred"
    | "reserved"
    | "returned";
  title: string | null;
  created_at: string; // ISO timestamp
}

export type AdviserWithAdvisees = {
  adviser_id: string;
  adviser_name: string;
  adviser_email: string | null;
  total_advisees: number;
  advisees: Advisee[] | null; // null if none (because of json_agg)
};
