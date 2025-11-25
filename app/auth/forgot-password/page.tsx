/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProgressIndicator from "./ProgressIndicator";
import stepContent from "@/data/stepContent";
import EmailStep from "./EmailStep";
import GridOverlay from "@/components/GridOverlay";
import OTPStep from "./OTPStep";
import ResetPasswordStep from "./ResetPasswordStep";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [email, setEmail] = useState("");

  const startResendTimer = (seconds: number) => {
    setResendTimer(seconds);

    const interval = setInterval(() => {
      setResendTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden flex items-center justify-center md:p-4 bg-gray-50">
      <GridOverlay />

      {/* Main Card */}
      <div className="relative w-full max-w-md ">
        {/* Progress Indicator */}
        <ProgressIndicator step={step} />

        {/* Card */}
        <div className="md:bg-white/80  backdrop-blur-xl md:rounded-3xl md:shadow-2xl shadow-gray-200/50 md:border border-gray-200 px-6 pb-8 md:p-8 relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <img
              src="/images/logo.png"
              alt="Archivia Logo"
              className="h-13 object-cover"
            />
            <h2 className="text-4xl font-bold tracking-wide  uppercase">
              rchivia
            </h2>
          </div>

          {/* Header */}
          <div
            className="text-center mb-8 animate-slide-in"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-3xl font-bold mb-2">
              {stepContent[step]?.title}
            </h1>

            <p className="text-gray-500 text-sm">
              {stepContent[step]?.subtitle}
            </p>
          </div>

          {/* Email Step */}
          {step === "email" && (
            <EmailStep
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStep={setStep}
              setResendTimer={startResendTimer}
              setEmail={setEmail}
            />
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <OTPStep
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStep={setStep}
              resendTimer={resendTimer}
              email={email}
              setResendTimer={startResendTimer}
            />
          )}

          {/* Reset Password Step */}
          {step === "reset" && (
            <ResetPasswordStep
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              email={email}
            />
          )}
        </div>

        {/* Back to Login */}
        <div
          className="text-center mt-6 animate-slide-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/auth/login"
            prefetch
            className="text-gray-600 text-sm hover:text-black transition-colors duration-300 flex cursor-pointer items-center justify-center gap-2 mx-auto font-medium group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
