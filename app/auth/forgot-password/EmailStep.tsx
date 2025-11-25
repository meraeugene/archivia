"use client";

import { forgotPassword } from "@/actions/auth/forgotPassword";
import { isValidEmail } from "@/utils/isValidEmail";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailStepProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setStep: (step: "email" | "otp" | "reset") => void;
  setResendTimer: (time: number) => void;
  setEmail: (email: string) => void;
}

const EmailStep = ({
  isLoading,
  setIsLoading,
  setStep,
  setResendTimer,
  setEmail,
}: EmailStepProps) => {
  const [localEmail, setLocalEmail] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(localEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    const response = await forgotPassword(localEmail.trim());
    setIsLoading(false);

    if (response.success) {
      toast.success("OTP sent to your email!");
      setEmail(localEmail.trim());
      setStep("otp");
      setResendTimer(60);
    } else {
      toast.error(response.error);
    }
  };

  return (
    <form
      onSubmit={handleSendOTP}
      className="space-y-5 animate-slide-in"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-black">
          Email Address
        </label>

        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black"
            size={20}
          />

          <input
            type="email"
            value={localEmail}
            onChange={(e) => {
              setLocalEmail(e.target.value);
              setEmail(e.target.value);
            }}
            placeholder="your.email@example.com"
            className="reset-password-input"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="reset-password-btn">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Reset Code
          </>
        )}
      </button>
    </form>
  );
};

export default EmailStep;
