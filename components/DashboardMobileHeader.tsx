"use client";

import { Menu, X } from "lucide-react";
import { logout } from "@/actions/auth/logout";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adviserNavLinks } from "@/app/(faculty)/faculty/FacultySidebar";

interface MobileHeaderProps {
  headerTitle: string;
}

const DashboardMobileHeader = ({ headerTitle }: MobileHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="px-4 py-2 md:px-8 sticky lg:hidden top-0 z-50 bg-white border-b border-gray-100 ">
      {/* Header always visible */}
      <div className="flex justify-between items-center py-2  relative z-50 bg-white">
        <div className="flex items-center font-bold">{headerTitle}</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className=" hover:bg-gray-100 rounded-md transition-colors"
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
        <div className="lg:hidden fixed inset-0 z-40">
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
            <div className="flex flex-col  p-4 py-2 ">
              {/* Navigation links */}
              {adviserNavLinks.map((link, index) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                if (link.label === "Logout") {
                  return (
                    <button
                      key="logout"
                      onClick={handleLogout}
                      disabled={isPending}
                      className={`w-full flex cursor-pointer items-center py-2 transition-colors
                    text-gray-800 hover:text-black `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                          <span>Logging out...</span>
                        </div>
                      ) : (
                        link.label
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={index}
                    prefetch
                    href={link.href}
                    className={`py-2  flex  items-center ${
                      isActive
                        ? "font-semibold text-black"
                        : "text-gray-800 hover:text-black"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardMobileHeader;
