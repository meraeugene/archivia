"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const removeAllAdviseesFromAdviser = async (adviser_id: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .delete()
    .eq("adviser_id", adviser_id)
    // .in("status", ["pending", "accepted"]);
    .eq("status", "accepted");

  if (error) {
    console.error("Error removing all advisees from adviser:", error);
    throw new Error("Failed to remove all advisees.");
  }

  // Set current_leaders of the adviser to 0
  const { error: updateAdvError } = await supabase
    .from("adviser_current_leaders")
    .update({ current_leaders: 0 })
    .eq("adviser_id", adviser_id);

  if (updateAdvError)
    return {
      success: false,
      error: "Error updating adviser current leaders",
    };

  revalidatePath("/admin/manage-advisees");
  return { success: true };
};
