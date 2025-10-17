"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer duration-500 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
        bg-gradient-to-b from-black to-gray-900 text-white border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]
        hover:from-gray-800 hover:to-gray-700 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] 
      `}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5" />
    </button>
  );
}
