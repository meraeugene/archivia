"use client";

import { resendOtp } from "@/actions/auth/resendOtp";
import { verifyOtp } from "@/actions/auth/verifyOtp";
import { useState } from "react";
import { toast } from "sonner";

interface useOTPProps {
  email: string;
  resendTimer: number;
  setResendTimer: (time: number) => void;
  setIsLoading: (loading: boolean) => void;
  setStep: (step: "email" | "otp" | "reset") => void;
}

export function useOTP({
  email,
  resendTimer,
  setResendTimer,
  setIsLoading,
  setStep,
}: useOTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp(email, otpCode);
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);
        setStep("reset");
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);

    try {
      const response = await resendOtp(email);
      setIsResending(false);

      if (response.success) {
        toast.success("OTP resent successfully!");
        setResendTimer(60);
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      console.error(err);
      setIsResending(false);
      toast.error("Failed to resend OTP. Try again.");
    }
  };

  const handleOtpChangeSingle = (value: string) => {
    setOtp(value.split(""));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Allow empty string for deletion
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Only digits
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return;

    const newOtp = [...otp];
    // Support pasting multiple digits in one input
    for (let i = 0; i < numericValue.length && index + i < 6; i++) {
      newOtp[index + i] = numericValue[i];
    }
    setOtp(newOtp);

    // Move focus to next empty input
    const firstEmptyIndex = newOtp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1) {
      const nextInput = document.getElementById(`otp-${firstEmptyIndex}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/\D/g, ""); // Only numbers
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length && i < 6; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    const firstEmptyIndex = newOtp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1) {
      const nextInput = document.getElementById(`otp-${firstEmptyIndex}`);
      nextInput?.focus();
    }
  };

  return {
    otp,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleVerifyOTP,
    handleResend,
    isResending,
    handleOtpChangeSingle,
  };
}
