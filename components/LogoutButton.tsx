"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex text-sm cursor-pointer items-center space-x-2 w-full text-left  py-2 hover:bg-gray-100 disabled:opacity-50  px-4"
    >
      {pending ? (
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span>Logging out...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <LogOut size={16} className="text-gray-600" />
          <span>Logout</span>
        </div>
      )}
    </button>
  );
}
