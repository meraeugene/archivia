/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { logout } from "@/actions/auth";
import { getInitials } from "@/utils/getInitials";
import { ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { CurrentUser } from "@/types/currentUser";
import { StudentAdviser } from "@/types/studentAdviser";

interface HeaderProps {
  currentUser: CurrentUser | null;
  navLinks: { label: string; href: string }[];
  studentAdviser?: StudentAdviser | null;
}

const Header = ({ currentUser, navLinks, studentAdviser }: HeaderProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hideFindAdviser =
    currentUser?.role === "faculty" ||
    (currentUser?.role === "student" && studentAdviser);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center ">
            <img src="/images/logo.png" alt="Archivia Logo" className="h-8" />
            <Link prefetch href="/" className="text-xl font-bold tracking-wide">
              RCHIVIA
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks
              .filter(
                ({ label }) => !(hideFindAdviser && label === "Find Adviser")
              )
              .map(({ label, href }) => {
                if (href === "/auth/login" && currentUser) return null;

                const isActive = pathname === href;
                const linkClass =
                  href === "/auth/login"
                    ? "font-medium bg-black text-white hover:bg-black/90 px-4 py-[0.4rem] rounded-md"
                    : isActive
                    ? "font-semibold text-black"
                    : "text-gray-800 hover:text-black";

                return (
                  <Link prefetch key={href} href={href} className={linkClass}>
                    {label}
                  </Link>
                );
              })}

            {/* Student adviser badge */}

            {/* Student-only link */}
            {currentUser?.role === "student" && studentAdviser && (
              <Link
                prefetch
                href="/publish-thesis"
                className={
                  pathname === "/publish-thesis"
                    ? "font-semibold text-black"
                    : "text-gray-800 hover:text-black"
                }
              >
                Publish Thesis
              </Link>
            )}

            {/* Faculty-only link */}
            {currentUser?.role === "faculty" && (
              <Link
                prefetch
                href="/dashboard"
                className={
                  pathname === "/dashboard"
                    ? "font-semibold text-black"
                    : "text-gray-800 hover:text-black"
                }
              >
                Dashboard
              </Link>
            )}

            {/* Avatar + Dropdown */}
            {currentUser && (
              <div className="relative">
                <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {currentUser.profile_picture ? (
                    <img
                      src={currentUser.profile_picture}
                      alt={currentUser.full_name}
                      className="object-cover rounded-full w-9 h-9"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black text-white font-bold">
                      {getInitials(currentUser.full_name)}
                    </div>
                  )}
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 text-sm">
                      <div className="font-medium text-gray-900 ">
                        {currentUser.prefix} {currentUser.full_name}{" "}
                        {currentUser.suffix}
                      </div>
                      {currentUser.email && (
                        <span className="truncate text-gray-700">
                          {currentUser.email}
                        </span>
                      )}
                    </div>

                    {/* Profile link */}
                    <Link
                      prefetch
                      href={`/profile/${currentUser.user_id}`}
                      className="flex text-sm items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <User size={16} className="text-gray-600" />
                      <span>Profile</span>
                    </Link>

                    {/* Bookmarks link */}
                    {currentUser.role === "student" && (
                      <Link
                        prefetch
                        href={`/my-requests`}
                        className="flex text-sm items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        <ClipboardList size={16} className="text-gray-600" />
                        <span>My Requests</span>
                      </Link>
                    )}

                    {/* Logout */}
                    <form action={logout}>
                      <LogoutButton />
                    </form>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
