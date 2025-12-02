"use server";

import { sendAuthorizeUploadEmail } from "@/utils/nodemailer/sendAuthorizedEmail";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function authorizeUpload(
  requestId: string,
  studentEmail: string,
  studentName: string,
  thesisTitle: string,
  adviserName: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_requests")
    .update({
      is_authorized: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { success: false, error: "Failed to authorize upload." };

  await sendAuthorizeUploadEmail({
    to: studentEmail, // student's email
    studentName: studentName, // student's name
    thesisTitle: thesisTitle, // thesis title
    message: `Your adviser, ${adviserName}, has authorized you to publish your thesis.`,
  });

  revalidatePath("/advisees");

  return {
    success: true,
    message:
      "Upload authorized successfully. The student can now proceed with the upload.",
  };
}
