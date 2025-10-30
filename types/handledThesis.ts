export type HandledThesis = {
  thesis_id: number;
  title: string;
  abstract: string | null;
  keywords: string[] | null;
  proponents: string[] | null;
  adviser_id: string | null;
  adviser_user_id: string | null;
  adviser_full_name: string | null;
  adviser_email: string | null;
  adviser_position: string | null;
  panel_member1: string;
  panel_member2: string;
  panel_member3: string;
  defense_year: number | null;
  category: string[] | null;
  file_url: string | null;
  created_at: string | null;
};
