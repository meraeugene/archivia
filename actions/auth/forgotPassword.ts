"use server";

import { sendOtpEmail } from "@/utils/nodemailer/sendOtpEmail";
import { generateOTP } from "@/utils/generateOTP";
import { createClient } from "@/utils/supabase/server";

export async function forgotPassword(email: string) {
  const supabase = await createClient();

  // Step 1: Check if email exists
  const { data: user, error } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (error || !user) {
    return { success: false, error: "Email is not registered." };
  }

  // Step 2: Generate OTP
  const otp = generateOTP();

  // Step 3: Send OTP via email
  const emailResult = await sendOtpEmail(otp, email);
  if (!emailResult.success) return emailResult;

  // Step 4: Store OTP in database for verification
  const { error: otpError } = await supabase.from("user_otps").insert({
    user_id: user.user_id,
    otp,
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  if (otpError) {
    console.error("Failed to store OTP:", otpError.message);
    return { success: false, error: "Failed to store OTP. Try again later." };
  }

  return { success: true, message: "OTP sent successfully!" };
}
