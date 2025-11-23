"use client";

import { Menu, X } from "lucide-react";
// import { logout } from "@/actions/auth/logout";
import { useState } from "react";
import { usePathname } from "next/navigation";
// import { CurrentUser } from "@/types/currentUser";
import { adviserNavLinks } from "@/app/(adviser)/FacultySidebar";
import Link from "next/link";

interface MobileHeaderProps {
  headerTitle: string;
  // currentUser: CurrentUser | null;
}

const DashboardMobileHeader = ({
  headerTitle,
}: // currentUser,
MobileHeaderProps) => {
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  return (
    <header className="px-4 py-2 sticky md:hidden top-0 z-50 bg-white border-b border-gray-100 ">
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
            <div className="flex flex-col  p-4 py-2">
              {/* Navigation links */}
              {adviserNavLinks.map((link, index) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

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

            {/* Logout button */}
            {/* {currentUser && (
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
            )} */}
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardMobileHeader;
