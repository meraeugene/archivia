"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function authorizeUpload(requestId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .update({
      is_authorized: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { success: false, error: "Failed to authorize upload." };

  revalidatePath("/advisees");
  revalidatePath("/");

  return {
    success: true,
    message:
      "Upload authorized successfully. The student can now proceed with the upload.",
  };
}
