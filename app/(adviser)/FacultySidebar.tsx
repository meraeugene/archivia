"use client";

import { getInitials } from "@/utils/getInitials";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Settings,
  LayoutDashboard,
  LogOutIcon,
  Users,
  // FileCheck,
  BookOpen,
  Lock,
} from "lucide-react";
import { useTransition } from "react";
import { CurrentUser } from "@/types/currentUser";
import { logout } from "@/actions/auth/logout";

const adviserNavLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Advisory Requests", href: "/advisory-requests", icon: FileText },
  { label: "Advisees", href: "/advisees", icon: Users },
  // { label: "Thesis Approval", href: "/thesis-approval", icon: FileCheck },
  { label: "Handled Thesis", href: "/handled-thesis", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Logout", href: "/", icon: LogOutIcon },
];

interface SidebarProps {
  currentUser: CurrentUser;
  pendingAdviserRequestCount: number;
  currentAdviserLeadersCount: number;
  thesisSubmissionsCount: number | null;
}

const FacultySidebar = ({
  currentUser,
  pendingAdviserRequestCount,
  currentAdviserLeadersCount,
  thesisSubmissionsCount,
}: SidebarProps) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <aside className="-translate-x-full lg:translate-x-0  transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xs border border-gray-100 overflow-y-auto hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Faculty Portal</h1>
        </div>

        <div className="flex items-center space-x-3 border-b py-4 border-gray-100 px-4">
          {currentUser?.profile_picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.full_name}
              className="object-cover rounded-full w-9 h-9"
            />
          ) : (
            <div className="w-9 h-9 cursor-pointer rounded-full overflow-hidden flex items-center justify-center bg-black text-white font-bold">
              {getInitials(currentUser?.full_name)}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.prefix} {currentUser?.full_name}{" "}
              {currentUser?.suffix}
            </p>
            <p className="text-xs text-gray-500">{currentUser?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {adviserNavLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            // Handle Logout separately
            if (item.label === "Logout") {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  disabled={isPending}
                  className={`w-full flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
          text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    item.label
                  )}
                </button>
              );
            }

            // Special case for Advisees
            if (item.label === "Advisees") {
              const isDisabled = currentAdviserLeadersCount === 0;
              return (
                <Link
                  href={isDisabled ? "#" : item.href}
                  key={item.href}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
          ${
            isDisabled
              ? "cursor-pointer hover:bg-gray-50 hover:text-gray-900 text-gray-600"
              : isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {isDisabled && (
                    <Lock className="ml-auto h-4 w-4 text-black " />
                  )}
                  {!isDisabled && currentAdviserLeadersCount > 0 && (
                    <span className="ml-auto bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
                      {currentAdviserLeadersCount}
                    </span>
                  )}
                </Link>
              );
            }

            // Default rendering for other links
            return (
              <Link
                prefetch
                key={item.href}
                href={item.href}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}

                {item.label === "Advisory Requests" &&
                  pendingAdviserRequestCount > 0 && (
                    <span className="ml-auto bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
                      {pendingAdviserRequestCount}
                    </span>
                  )}

                {item.label === "Thesis Approval" &&
                  thesisSubmissionsCount !== 0 && (
                    <span className="ml-auto bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
                      {thesisSubmissionsCount}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default FacultySidebar;
