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

export interface WildcardThesis {
  title: string;
  abstract: string;
  similarity: number;
  status: string;
}

export type WildcardAdviser = {
  adviser: string;
  research_interest: string;
  top_theses: WildcardThesis[];
};

export type Adviser = {
  id: string;
  availability: string;
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
  current_leaders: number;
  projects: {
    abstract: string;
    title: string;
    similarity: number;
  }[];
  already_requested: boolean;
};
