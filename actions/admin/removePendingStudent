"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const removePendingStudent = async (
  student_id: string,
  adviser_id: string
) => {
  const supabase = await createClient();

  // Delete the pending request
  const { error } = await supabase
    .from("student_requests")
    .delete()
    .eq("student_id", student_id)
    .eq("adviser_id", adviser_id)
    .eq("status", "pending"); // only remove pending

  if (error) {
    console.error("Error removing pending student:", error);
    throw new Error("Failed to remove pending student.");
  }

  revalidatePath("/admin/manage-advisees"); // revalidate the page
  return { success: true };
};
