"use client";

import { useOTP } from "@/hooks/useOTP";

interface OTPStepProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setStep: (step: "email" | "otp" | "reset") => void;
  resendTimer: number;
  email: string;
  setResendTimer: (time: number) => void;
}

const OTPStep = ({
  isLoading,
  setIsLoading,
  setStep,
  resendTimer,
  email,
  setResendTimer,
}: OTPStepProps) => {
  const {
    otp,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleVerifyOTP,
    handleResend,
    isResending,
  } = useOTP({ email, resendTimer, setResendTimer, setIsLoading, setStep });

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-6 animate-slide-in">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
          Enter 5-Digit Code
        </label>
        <div className="flex gap-2 justify-center mb-4 ">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={handleOtpPaste}
              className="reset-password-otp"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0 || isResending}
          className={`text-gray-500  text-sm w-full text-center font-medium ${
            resendTimer > 0 || isResending
              ? "cursor-not-allowed opacity-50"
              : "hover:text-black cursor-pointer "
          }`}
        >
          {resendTimer > 0
            ? `Resend available in ${resendTimer}s`
            : "Didn't receive code? Resend"}
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading || isResending}
        className="w-full bg-black text-white py-3.5 rounded-md font-semibold   disabled:cursor-not-allowed disabled:opacity-90 hover:bg-black/90 cursor-pointer  flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          <span>Verify Code</span>
        )}
      </button>

      {/* <button
        onClick={() => setStep("email")}
        className="w-full text-gray-500 text-sm hover:text-black cursor-pointer transition-colors duration-300 flex items-center group justify-center gap-2 font-medium"
      >
        <ArrowLeft
          className="group-hover:-translate-x-1 transition-transform duration-300"
          size={16}
        />
        Back to Email
      </button> */}
    </form>
  );
};

export default OTPStep;
