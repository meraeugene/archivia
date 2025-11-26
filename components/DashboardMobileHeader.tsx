"use client";

import { Menu, X } from "lucide-react";
import { logout } from "@/actions/auth/logout";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adviserNavLinks } from "@/app/(faculty)/FacultySidebar";

interface MobileHeaderProps {
  headerTitle: string;
}

const DashboardMobileHeader = ({ headerTitle }: MobileHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    document.body.style.overflow = "auto";
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="sticky top-0 z-50 lg:hidden">
      {/* Header Bar */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="px-4 md:px-8 h-16 flex items-center justify-between">
          <h1 className="text-base md:text-lg font-semibold text-gray-900 ">
            {headerTitle}
          </h1>

          {/* Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              document.body.style.overflow = mobileMenuOpen ? "auto" : "hidden";
            }}
            className="relative  hover:bg-gray-100/80 rounded-xl transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 text-gray-900 transition-all duration-300 ${
                  mobileMenuOpen
                    ? "opacity-0 rotate-90 scale-50"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 text-gray-900 transition-all duration-300 ${
                  mobileMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-50"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop below header */}
          <div className="fixed inset-x-0 top-16 bottom-0  bg-black/20 backdrop-blur-sm transition-opacity duration-300" />

          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 z-50 bg-white border-y border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-1 duration-300">
            <nav className="divide-y divide-gray-100">
              {adviserNavLinks.map((link, index) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                if (link.label === "Logout") {
                  return (
                    <button
                      key="logout"
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full group flex items-center gap-4 px-6 pl-4 md:px-8 h-14 text-left transition-colors duration-150 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-200"
                    >
                      {isPending ? (
                        <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {isPending ? "Logging out..." : link.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={index}
                    prefetch
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      document.body.style.overflow = "auto";
                    }}
                    className={`group flex items-center gap-4 px-6 pl-4 md:px-8 h-14 transition-colors duration-150 ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium uppercase tracking-wide">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default DashboardMobileHeader;
