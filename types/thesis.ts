export interface Thesis {
  id: number;
  title: string;
  adviser_name: string;
  keywords: string[];
  panel_chair_name: string;
  panel_members: string[];
  proponents: string[];
  defense_year: number;
  pages: number;
  abstract: string;
  category: string;
}
