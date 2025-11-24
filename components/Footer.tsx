/* eslint-disable @next/next/no-img-element */
"use client";

import { footerLinks } from "@/data/links";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full  border-t border-white/[0.08] pt-8 pb-8 relative z-20">
      <div className="max-w-6xl mx-auto px-6 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5 pr-0 md:pr-12">
            {/* Logo */}
            <div className="flex items-center mb-3">
              <img src="/images/logo.png" alt="Archivia Logo" className="h-8" />
              <Link
                prefetch
                href="/"
                className="text-xl font-bold tracking-wide"
              >
                RCHIVIA
              </Link>
            </div>

            <p className="text-[14px] text-brand-muted leading-relaxed max-w-xs">
              The secure digital archiving standard for the modern academic
              world. Preserving knowledge for future generations.
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="flex flex-col">
                <h4 className="text-black font-semibold mb-5 text-[13px] uppercase tracking-wider">
                  {section}
                </h4>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-brand-muted hover:text-white transition-colors duration-200 block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-[12px] text-brand-muted">
            © {new Date().getFullYear()} Archivia Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a
              href="#"
              className="text-[12px] text-brand-muted hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[12px] text-brand-muted hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-[12px] text-brand-muted hover:text-white transition-colors"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
