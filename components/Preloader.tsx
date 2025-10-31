/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

export default function Preloader({ redirectTo }: { redirectTo: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    }, 1500);

    return () => clearTimeout(timer);
  }, [redirectTo]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img src="/images/logo.png" alt="Archivia Logo" className="h-22" />
        <h1 className="text-6xl font-bold tracking-wide">RCHIVIA</h1>
      </div>
      <p className="text-lg text-gray-600 tracking-wide ">
        Digital Thesis Archive
      </p>
    </div>
  );
}
