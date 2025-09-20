"use client";

import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = ({
  session,
  navLinks,
}: {
  session: unknown;
  navLinks: { label: string; href: string }[];
}) => {
  const pathname = usePathname();

  console.log(session);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center py-3">
          {/* Logo / Title */}
          <Link href="/" className="text-3xl font-bold tracking-tight">
            Archivia
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ label, href }) => {
              if (session && href === "/auth/login") return null;

              const isActive = pathname === href;

              return (
                <Link
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

            {/* If logged in */}
            {session ? (
              <>
                <Link
                  href="/account"
                  className="text-gray-800 hover:text-black"
                >
                  Profile
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="font-medium bg-black text-white hover:bg-black/90 cursor-pointer px-4 py-[0.4rem] rounded"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
