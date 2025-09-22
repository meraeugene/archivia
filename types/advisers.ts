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

export interface Adviser {
  adviser: string;
  score: number;
  capacity: string; // e.g., "2/5"
  user_id: string;
  projects: Project[];
}
