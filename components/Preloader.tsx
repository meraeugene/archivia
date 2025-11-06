/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Preloader({ redirectTo }: { redirectTo: string }) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);

      // Wait for fade-out (e.g. 300ms), then navigate
      setTimeout(() => {
        router.push(redirectTo); // 🔥 fast client-side route change
      }, 0);
    }, 500); // shorter delay before fade-out

    return () => clearTimeout(timer);
  }, [redirectTo, router]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center">
        <img
          src="/images/logo.png"
          alt="Archivia Logo"
          className="h-18 md:h-22"
        />
        <h1 className="text-5xl md:text-6xl font-bold tracking-wide">
          RCHIVIA
        </h1>
      </div>
      <p className="md:text-lg mt-1 md:mt-0 text-gray-600 tracking-wide">
        Digital Thesis Archive
      </p>
    </div>
  );
}
