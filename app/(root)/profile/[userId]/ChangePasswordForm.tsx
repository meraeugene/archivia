"use client";

import { useState, useTransition, FormEvent } from "react";
import { changePassword } from "@/actions/auth";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { isStrongPassword } from "@/utils/isStrongPassword";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    startTransition(async () => {
      const result = await changePassword(oldPassword, newPassword);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Password updated successfully. Please log in again.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 ">
      {/* Old Password */}
      <div>
        <label className="font-bold uppercase text-sm tracking-wider mb-2 block">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your current password"
            className="w-full border border-gray-300  p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute cursor-pointer right-3 top-3.5 text-gray-500 hover:text-gray-700"
          >
            {showOld ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="mb-6">
        <label className="font-bold uppercase text-sm tracking-wider mb-2 block">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute cursor-pointer right-3 top-3.5 text-gray-500 hover:text-gray-700"
          >
            {showNew ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <ActionButton
        label={isPending ? "Updating..." : "Update Password"}
        onClick={() => handleSubmit}
        icon={<ArrowRight className="w-4 h-4" />}
        hover="translate-x-2"
        disabled={isPending}
      />
    </form>
  );
}
