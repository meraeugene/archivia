export interface StudentData {
  title: string;
  abstract: string;
}

export type StudentDataField = keyof StudentData;

export interface Project {
  title: string;
  similarity: number;
  abstract: string;
}

export type Adviser = {
  id: string;
  full_name: string;
  prefix: string | null;
  suffix: string | null;
  email: string | null;
  profile_picture: string | null;
  position: string | null;
  bio: string | null;
  highest_educational_attainment: string | null;
  research_interest: string | null;
  orcid: string | null;
  handled_subjects: string | null;
  max_leaders: number;
  current_leaders: number;
};
