"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const removeStudentFromAdviser = async (
  student_id: string,
  adviser_id: string
) => {
  const supabase = await createClient();

  console.log("student id", student_id);
  console.log("adviser id", adviser_id);

  const { error } = await supabase
    .from("student_requests")
    .delete()
    .eq("student_id", student_id)
    .eq("adviser_id", adviser_id)
    // .in("status", ["pending", "accepted"]);
    .eq("status", "accepted");

  if (error) {
    console.error("Error removing student from adviser:", error);
    throw new Error("Failed to remove student from adviser.");
  }

  // Get current_leaders of the adviser
  const { data: advData, error: advError } = await supabase
    .from("adviser_current_leaders")
    .select("current_leaders")
    .eq("adviser_id", adviser_id)
    .single();

  if (advError) return { success: false, error: advError.message };

  //  Decrement adviser current_leaders
  const { error: updateAdvError } = await supabase
    .from("adviser_current_leaders")
    .update({ current_leaders: advData.current_leaders - 1 })
    .eq("adviser_id", adviser_id);

  if (updateAdvError)
    return {
      success: false,
      error: "Error updating adviser current leaders",
    };

  revalidatePath("/admin/manage-advisees");
  return { success: true };
};
