"use client";

import { logout } from "@/actions/auth";
import { getInitials } from "@/utils/getInitials";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

interface HeaderProps {
  currentUser: {
    email: string;
    full_name: string;
    prefix: string | null;
    profile_picture: string | null;
    role: "student" | "faculty" | "admin";
    suffix: string | null;
    user_id: string;
  } | null;
  navLinks: { label: string; href: string }[];
}

const Header = ({ currentUser, navLinks }: HeaderProps) => {
  const pathname = usePathname();

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
                if (
                  currentUser?.role === "faculty" &&
                  label === "Find Adviser"
                ) {
                  return false; // hide only Find Adviser
                }
                return true; // show everything else
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

            {currentUser?.role === "faculty" && (
              <Link
                prefetch
                href="/dashboard"
                className="text-gray-800  hover:text-black "
              >
                Dashboard
              </Link>
            )}

            {/* If logged in */}
            {currentUser ? (
              <div className="relative group">
                <div className="w-9 h-9 cursor-pointer rounded-full overflow-hidden flex items-center justify-center bg-black text-white font-bold">
                  {currentUser.profile_picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.profile_picture}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(currentUser.full_name)
                  )}
                </div>

                {/* Dropdown (hover only) */}
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg  
             opacity-0 scale-95 transform transition-all duration-200 origin-top-right 
             group-hover:opacity-100 group-hover:scale-100"
                >
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
                  >
                    {" "}
                    <User size={16} className="text-gray-600" />{" "}
                    <span>Profile</span>{" "}
                  </Link>

                  {/* Logout */}
                  <form action={logout}>
                    <LogoutButton />
                  </form>
                </div>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
