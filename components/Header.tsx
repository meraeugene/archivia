"use client";

import { navLinks } from "@/data/links";
import Link from "next/link";

const Header = () => {
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
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={
                  href === "/auth/login"
                    ? "font-medium bg-black text-white border hover:bg-black/90 shadow-xs px-4 py-[0.4rem] rounded-md"
                    : "text-gray-800 hover:text-black transition-opacity"
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
