"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/getSession";
import { cache } from "react";

export const getAllTheses = cache(
  async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "newest",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
  }) => {
    const supabase = await createClient();
    const session = await getSession();

    if (!session?.sub || session.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase.from("theses").select("*", { count: "exact" });

    // Search filter
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,adviser_name.ilike.%${search}%`
      );
    }

    // Sorting
    if (sortBy === "newest")
      query = query.order("created_at", { ascending: false });
    else if (sortBy === "oldest")
      query = query.order("created_at", { ascending: true });
    else if (sortBy === "title")
      query = query.order("title", { ascending: true });
    else if (sortBy === "adviser")
      query = query.order("adviser_name", { ascending: true });

    // Pagination
    const { data, error, count } = await query.range(start, end);

    if (error) throw new Error(error.message);

    return {
      theses: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
);

export async function editThesis({
  id,
  title,
  abstract,
  keywords,
  proponents,
  adviser_id,
  adviser_name,
  defense_year,
  category,
  file_url,
  panel_member1,
  panel_member2,
  panel_member3,
}: {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string[];
  proponents?: string[];
  adviser_id?: string | null;
  adviser_name?: string | null;
  defense_year?: number | null;
  category?: string[];
  file_url?: string | null;
  panel_member1?: string | null;
  panel_member2?: string | null;
  panel_member3?: string | null;
}) {
  const supabase = await createClient();
  const session = await getSession();

  if (
    !session?.sub ||
    (session.role !== "admin" && session.role !== "adviser")
  ) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("theses")
    .update({
      title,
      abstract,
      keywords,
      proponents,
      adviser_id,
      adviser_name,
      defense_year,
      category,
      file_url,
      panel_member1,
      panel_member2,
      panel_member3,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/manage-thesis");
}

export async function deleteThesis(id: number) {
  const supabase = await createClient();
  const session = await getSession();

  if (
    !session?.sub ||
    (session.role !== "admin" && session.role !== "adviser")
  ) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("theses").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/manage-thesis");
}
