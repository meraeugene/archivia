/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { CurrentUser } from "@/types/currentUser";
import { logout } from "@/actions/auth/logout";
import { JSX, useState } from "react";
import { usePathname } from "next/navigation";

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentUser: CurrentUser | null;
  renderLinks: (isMobile?: boolean) => JSX.Element;
}

const MobileHeader = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  currentUser,
  renderLinks,
}: MobileHeaderProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();

  return (
    <header className="sticky md:hidden top-0 z-50 bg-white border-b border-gray-100 ">
      {/* Header always visible */}
      <div className="flex justify-between items-center py-2 px-2 relative z-50 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Archivia Logo" className="h-8" />
          <Link prefetch href="/" className="text-xl font-bold tracking-wide">
            RCHIVIA
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Menu + Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Blur overlay only behind menu panel */}
          <div
            className="absolute top-[4rem] bottom-0 left-0 right-0 bg-black/10 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div
            className="absolute top-[55px]  left-0 right-0 bg-white border-t z-50 animate-in fade-in slide-in-from-top-2 duration-300"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* User info */}
            {currentUser && (
              <div className="space-y-3 p-4 border-t ">
                <div className="flex items-center space-x-3">
                  {currentUser.profile_picture ? (
                    <img
                      src={currentUser.profile_picture}
                      alt={currentUser.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white font-bold">
                      {getInitials(currentUser.full_name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {currentUser.prefix} {currentUser.full_name}{" "}
                      {currentUser.suffix}
                    </div>
                    <div className="text-gray-600 text-xs truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <Link
                  prefetch
                  href={`/profile/${currentUser.user_id}`}
                  className={`block ${
                    pathname === `/profile/${currentUser.user_id}`
                      ? "font-semibold text-black"
                      : "text-gray-800 hover:text-black"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                {currentUser.role === "student" && (
                  <Link
                    prefetch
                    href="/my-requests"
                    className={`block ${
                      pathname === "/my-requests"
                        ? "font-semibold text-black"
                        : "text-gray-800 hover:text-black"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Requests
                  </Link>
                )}
              </div>
            )}

            {/* Navigation links */}
            <div className="p-4 border-t">{renderLinks(true)}</div>

            {/* Logout button */}
            {currentUser && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoggingOut(true);
                  await logout(); // call server action
                }}
                className="py-4 px-4 border-t shadow-2xl"
              >
                <button
                  type="submit"
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 w-full text-left hover:bg-gray-100 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    <div>Logout</div>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
