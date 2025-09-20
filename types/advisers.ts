export type StudentData = {
  thesisTitle: string;
  abstract: string;
  availability: string;
};

export type StudentDataField = keyof StudentData;

export type Adviser = {
  id: string | number;
  name: string;
  students: number;
  bio: string;
  specialization: string[];
  availability: string[];
};
