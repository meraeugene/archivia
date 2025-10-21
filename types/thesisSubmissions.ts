export type ThesisSubmission = {
  id: string;
  student_id: string;
  adviser_id: string;
  adviser_name: string;
  title: string;
  abstract: string;
  keywords: string[];
  proponents: string[];
  panel_chair_name?: string | null;
  panel_members?: string[] | null;
  defense_year?: number | null;
  category: string[];
  file_url: string;
  status: "pending" | "approved" | "returned";
  feedback?: string | null;
  created_at?: string;
  updated_at?: string;

  // Student info from the joined user_profiles
  student_name: string;
  student_email?: string | null;
  student_course?: string | null;
  student_year_level?: number | null;
  student_profile_picture?: string | null;
};
