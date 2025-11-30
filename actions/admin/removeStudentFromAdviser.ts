"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const removeStudentFromAdviser = async (
  student_id: string,
  adviser_id: string
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .delete()
    .eq("student_id", student_id)
    .eq("adviser_id", adviser_id)
    .in("status", ["pending", "accepted"]);

  if (error) {
    console.error("Error removing student from adviser:", error);
    throw new Error("Failed to remove student from adviser.");
  }

  revalidatePath("/admin/manage-advisees");
  return { success: true };
};
