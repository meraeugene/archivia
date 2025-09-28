"use client";

import { useState } from "react";
import { logout } from "@/actions/auth";
import { getInitials } from "@/utils/getInitials";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { CurrentUser } from "@/types/currentUser";
import { StudentAdviser } from "@/types/studentAdviser";

interface HeaderProps {
  currentUser: CurrentUser | null;
  navLinks: { label: string; href: string }[];
  studentAdviser: StudentAdviser | null; // 👉 make nullable
}

const Header = ({ currentUser, navLinks, studentAdviser }: HeaderProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center py-3">
          {/* Logo / Title */}
          <Link prefetch href="/" className="text-3xl font-bold tracking-tight">
            Archivia
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks
              .filter(({ label }) => {
                // Faculty should never see "Find Adviser"
                if (
                  currentUser?.role === "faculty" &&
                  label === "Find Adviser"
                ) {
                  return false;
                }

                // Student already has adviser → hide "Find Adviser"
                if (
                  currentUser?.role === "student" &&
                  studentAdviser &&
                  label === "Find Adviser"
                ) {
                  return false;
                }

                return true;
              })
              .map(({ label, href }) => {
                if (href === "/auth/login" && currentUser) return null;

                const isActive = pathname === href;

                return (
                  <Link
                    prefetch
                    key={href}
                    href={href}
                    className={
                      href === "/auth/login"
                        ? "font-medium bg-black text-white hover:bg-black/90 px-4 py-[0.4rem] rounded-md"
                        : isActive
                        ? "font-semibold text-black"
                        : "text-gray-800 hover:text-black"
                    }
                  >
                    {label}
                  </Link>
                );
              })}

            {currentUser?.role === "student" && studentAdviser && (
              <div className="flex items-center rounded  border border-gray-200 border-r-black border-r-4  ">
                {/* Left side: Label */}
                <div className="bg-black  text-white rounded rounded-br-none rounded-tr-none px-4  h-full py-2  text-sm font-medium">
                  My Adviser
                </div>

                {/* Right side: Adviser info */}
                <div className="flex items-center space-x-3 flex-1  px-4 ">
                  <span className="text-gray-900 font-medium">
                    {studentAdviser.adviser_name}
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

            {currentUser?.role === "faculty" && (
              <Link
                prefetch
                href="/dashboard"
                className="text-gray-800 hover:text-black"
              >
                Dashboard
              </Link>
            )}

            {/* If logged in */}
            {currentUser ? (
              <div className="relative">
                {/* Avatar (click target) */}
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

                {/* Dropdown (click toggle) */}
                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
                      <div className="font-medium text-gray-900 truncate">
                        {currentUser?.full_name}
                      </div>
                      {currentUser?.email && (
                        <span className="truncate">{currentUser.email}</span>
                      )}
                    </div>

                    {/* Profile link */}
                    <Link
                      prefetch
                      href="/profile"
                      className="flex text-sm items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <User size={16} className="text-gray-600" />
                      <span>Profile</span>
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                      <LogoutButton />
                    </form>
                  </div>
                )}
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
