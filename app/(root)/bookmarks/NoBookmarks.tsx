"use client";

import Link from "next/link";

const NoBookmarks = () => {
  return (
    <div className="relative overflow-hidden min-h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
      <div className="relative max-w-7xl mx-auto px-6 md:py-20 py-12 text-center">
        <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-5 tracking-tight">
          No Bookmarks Yet
        </h1>
        <div className="w-48 h-1 bg-white mx-auto md:mb-8 mb-5"></div>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Browse the{" "}
          <Link prefetch href="/" className="text-blue-300 hover:underline">
            Thesis Archive
          </Link>{" "}
          and bookmark your favorite works.
        </p>
      </div>
    </div>
  );
};

export default NoBookmarks;
