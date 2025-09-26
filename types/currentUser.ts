export type CurrentUser = {
  user_id: string;
  role: "student" | "faculty" | "admin";
  email: string;
  full_name: string;
  prefix: string | null;
  suffix: string | null;
  profile_picture: string | null;

  // Adviser-only fields
  position?: string | null;
  bio?: string | null;
  highest_educational_attainment?: string | null;
  research_interest?: string | null;
  orcid?: string | null;
  handled_subjects?: string | null;

  // Student-only fields
  course?: string | null;
  year_level?: number | null;
  section?: string | null;
};
