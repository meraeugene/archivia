export interface ManageThesis {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string[];
  proponents?: string[];
  adviser_id?: string;
  adviser_name?: string;
  defense_year?: number;
  category?: string[];
  file_url?: string;
  panel_member1?: string;
  panel_member2?: string;
  panel_member3?: string;
  created_at: string;
}

export type EditableThesis = Partial<Omit<ManageThesis, "id" | "created_at">>;
