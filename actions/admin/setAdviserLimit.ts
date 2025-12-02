"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/getSession";

export async function setAdviserLimit(adviser_id: string, max_limit: number) {
  const session = await getSession();

  if (!session?.sub || session.role !== "admin") {
    return { error: "Unauthorized" };
  }

  if (max_limit < 0) {
    return { error: "Limit must be greater than 1." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("adviser_current_leaders")
    .update({ max_limit })
    .eq("adviser_id", adviser_id);

  if (error) {
    console.error("Error setting adviser limit:", error.message);
    return { error: "Failed to update adviser limit." };
  }

  revalidatePath("/manage-advisees");
  return { success: true };
}
