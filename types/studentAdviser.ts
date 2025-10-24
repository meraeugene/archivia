export type StudentAdviser = {
  student_id: string;
  adviser_id: string;
  full_name: string;
  email: string;
  profile_picture: string | null;
  prefix: string | null;
  suffix: string | null;
  position: string;
  bio: string;
  highest_educational_attainment: string;
  research_interest: string;
  orcid: string;
  handled_subjects: string;
};
