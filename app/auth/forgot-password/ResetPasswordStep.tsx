"use client";

import { resetPassword } from "@/actions/auth/resetPassword";
import { isStrongPassword } from "@/utils/isStrongPassword";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ResetPasswordStepProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  email: string;
}

const ResetPasswordStep = ({
  isLoading,
  setIsLoading,
  email,
}: ResetPasswordStepProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(email, newPassword); // pass email from OTP step
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);
        router.push("/auth/login");
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-5 animate-slide-in">
      {/* New Password */}
      <div className="group relative">
        <label className="hidden md:block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-gray-600">
          New Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gray-600"
            size={20}
          />
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="reset-password-input pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="group relative">
        <label className="hidden md:block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-gray-600">
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gray-600"
            size={20}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="reset-password-input pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-3.5 rounded-md font-semibold disabled:cursor-not-allowed hover:bg-black/90 cursor-pointer flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Resetting...
          </>
        ) : (
          <span>Reset Password</span>
        )}
      </button>
    </form>
  );
};

export default ResetPasswordStep;
