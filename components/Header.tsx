"use client";

import { useState } from "react";
import { logout } from "@/actions/auth";
import { getInitials } from "@/utils/getInitials";
import { Bookmark, User } from "lucide-react";
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
          <Link prefetch href="/" className="text-3xl font-bold tracking-tight">
            Archivia
          </Link>

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
            {currentUser?.role === "student" && studentAdviser && (
              <div className="flex items-stretch px-2 ">
                {/* Left: Label with icon */}
                <div className="bg-black text-white px-4 rounded-md rounded-tr-none rounded-br-none  py-2 text-sm font-medium flex items-center gap-2">
                  <User size={16} className="text-white" />
                  Adviser
                </div>

                {/* Right: Adviser Info */}
                <div className="flex items-center gap-2 rounded-tl-none rounded-bl-none rounded-md border border-gray-200 px-4 py-2 ">
                  <span className="text-gray-900 font-medium">
                    {studentAdviser.adviser_prefix}{" "}
                    {studentAdviser.adviser_name}{" "}
                    {studentAdviser.adviser_suffix}
                  </span>
                </div>
              </div>
            )}

            {/* Student-only link */}
            {currentUser?.role === "student" && (
              <Link
                prefetch
                href="/my-requests"
                className={
                  pathname === "/my-requests"
                    ? "font-semibold text-black"
                    : "text-gray-800 hover:text-black"
                }
              >
                My Requests
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
                    // eslint-disable-next-line @next/next/no-img-element
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
                    <Link
                      prefetch
                      href={`/bookmarks`}
                      className="flex text-sm items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <Bookmark size={16} className="text-gray-600" />
                      <span>Bookmarks</span>
                    </Link>

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
