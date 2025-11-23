/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ClipboardList, Menu, X } from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { CurrentUser } from "@/types/currentUser";
import { StudentAdviser } from "@/types/studentAdviser";
import { logout } from "@/actions/auth/logout";
import { LogoutButton } from "./LogoutButton";
import MobileHeader from "./MobileHeader";

interface HeaderProps {
  currentUser: CurrentUser | null;
  navLinks: { label: string; href: string }[];
  studentAdviser?: StudentAdviser | null;
  isAuthorizedToUploadThesis?: boolean;
}

export default function ResponsiveHeader({
  currentUser,
  navLinks,
  studentAdviser,
  isAuthorizedToUploadThesis,
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hideFindAdviser =
    currentUser?.role === "faculty" ||
    currentUser?.role === "admin" ||
    (currentUser?.role === "student" && studentAdviser);

  const showPublishThesis =
    currentUser?.role === "student" &&
    studentAdviser &&
    isAuthorizedToUploadThesis;

  const renderLinks = (isMobile = false) => (
    <div
      className={
        isMobile ? "flex flex-col space-y-4" : "flex space-x-6 items-center"
      }
    >
      {navLinks
        .filter(({ label }) => !(hideFindAdviser && label === "Find Adviser"))
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
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}

      {showPublishThesis && (
        <Link
          prefetch
          href="/publish-thesis"
          className={
            pathname === "/publish-thesis"
              ? "font-semibold text-black"
              : "text-gray-800 hover:text-black"
          }
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          Publish Thesis
        </Link>
      )}

      {currentUser?.role === "admin" && (
        <Link
          prefetch
          href="/admin/dashboard"
          className={
            pathname === "/admin/dashboard"
              ? "font-semibold text-black"
              : "text-gray-800 hover:text-black"
          }
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}

      {currentUser?.role === "faculty" && (
        <Link
          prefetch
          href="/dashboard"
          className={
            pathname === "/dashboard"
              ? "font-semibold text-black"
              : "text-gray-800 hover:text-black"
          }
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white  md:border-b border-gray-100">
      <div className="max-w-6xl mx-auto ">
        {/* Desktop Navigation */}
        <div className="md:flex justify-between hidden  items-center py-2 md:py-3 px-2 md:px-6 xl:px-0 ">
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
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            {renderLinks(false)}

            {/* Avatar Menu */}
            {currentUser && (
              <div className="relative">
                <div
                  onClick={() => setOpen((p) => !p)}
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
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-md border rounded-md animate-in fade-in zoom-in">
                    <div className="px-4 py-3 border-b text-sm">
                      <div className="font-medium text-gray-900">
                        {currentUser.prefix} {currentUser.full_name}{" "}
                        {currentUser.suffix}
                      </div>
                      <span className="text-gray-700 text-xs">
                        {currentUser.email}
                      </span>
                    </div>

                    <Link
                      prefetch
                      href={`/profile/${currentUser.user_id}`}
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>

                    {currentUser.role === "student" && (
                      <Link
                        prefetch
                        href="/my-requests"
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        <ClipboardList size={16} />
                        <span>My Requests</span>
                      </Link>
                    )}

                    <form action={logout}>
                      <LogoutButton />
                    </form>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <MobileHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentUser={currentUser}
          renderLinks={renderLinks}
        />
      </div>
    </header>
  );
}
