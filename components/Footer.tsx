"use client";
import { footerLinks } from "@/data/links";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black-50    border-t border-gray-100 ">
      <div className="max-w-6xl mx-auto px-4 py-10 md:px-0">
        <div className="flex items-start flex-col md:flex-row  space-y-10 md:space-y-0 justify-between">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold md:mb-4 mb-2">{section}</h4>
              <ul className="space-y-2 text-sm">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    {href.startsWith("#") ? (
                      <a
                        href={href}
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
