"use server";

import { sendOtpEmail } from "@/utils/nodemailer/sendOtpEmail";
import { generateOTP } from "@/utils/generateOTP";
import { createClient } from "@/utils/supabase/server";

export async function resendOtp(email: string) {
  const supabase = await createClient();

  // Step 1: Get user by email
  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return { success: false, error: "Email not found." };
  }

  // Step 2: Delete existing OTPs for this user
  const { error: deleteError } = await supabase
    .from("user_otps")
    .delete()
    .eq("user_id", user.user_id);

  if (deleteError) {
    console.error("Failed to delete previous OTPs:", deleteError.message);
    return { success: false, error: "Failed to resend OTP. Try again later." };
  }

  // Step 3: Generate new OTP
  const otp = generateOTP();

  // Step 4: Send OTP via email
  const emailResult = await sendOtpEmail(otp, email);
  if (!emailResult.success) return emailResult;

  // Step 5: Store new OTP in database
  const { error: otpError } = await supabase.from("user_otps").insert({
    user_id: user.user_id,
    otp,
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  if (otpError) {
    console.error("Failed to store new OTP:", otpError.message);
    return { success: false, error: "Failed to store OTP. Try again later." };
  }

  return { success: true, message: "OTP resent successfully!" };
}
