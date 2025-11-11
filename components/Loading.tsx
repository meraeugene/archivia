/* eslint-disable @next/next/no-img-element */
"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 animate-fade-in">
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

      {/* Inline style block for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
