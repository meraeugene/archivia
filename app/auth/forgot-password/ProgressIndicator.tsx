"use client";

import { Lock, Mail, Shield } from "lucide-react";

const ProgressIndicator = ({ step }: { step: "email" | "otp" | "reset" }) => {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <div
        className={`flex items-center gap-2 transition-all duration-500 ${
          step === "email" ? "scale-110" : "scale-100 opacity-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            step === "email"
              ? "bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-700/50"
              : "bg-gray-200"
          }`}
        >
          <Mail
            className={`${step === "email" ? "text-white" : "text-gray-500"}`}
            size={20}
          />
        </div>
      </div>

      <div
        className={`h-1 w-12 rounded-full transition-all duration-500 ${
          step !== "email"
            ? "bg-gradient-to-r from-gray-700 to-gray-900"
            : "bg-gray-200"
        }`}
      />

      <div
        className={`flex items-center gap-2 transition-all duration-500 ${
          step === "otp" ? "scale-110" : "scale-100 opacity-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            step === "otp"
              ? "bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-700/50"
              : "bg-gray-200"
          }`}
        >
          <Shield
            className={`${step === "otp" ? "text-white" : "text-gray-500"}`}
            size={20}
          />
        </div>
      </div>

      <div
        className={`h-1 w-12 rounded-full transition-all duration-500 ${
          step === "reset"
            ? "bg-gradient-to-r from-gray-700 to-gray-900"
            : "bg-gray-200"
        }`}
      />

      <div
        className={`flex items-center gap-2 transition-all duration-500 ${
          step === "reset" ? "scale-110" : "scale-100 opacity-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            step === "reset"
              ? "bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-700/50"
              : "bg-gray-200"
          }`}
        >
          <Lock
            className={`${step === "reset" ? "text-white" : "text-gray-500"}`}
            size={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
