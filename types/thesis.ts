export type Thesis = {
  id?: number;
  title: string;
  adviser_name: string;
  adviser_id: string;
  keywords: string[];
  panel_member1: string;
  panel_member2: string;
  panel_member3: string;
  proponents: string[];
  defense_year: number;
  pages?: number;
  abstract: string;
  category: string[];
  bookmark_id?: string;
  bookmarked_at?: string;
  file_url?: string;
};
