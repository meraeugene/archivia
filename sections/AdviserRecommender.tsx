"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCheck } from "lucide-react";

const AdviserRecommender = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-16 md:py-20 bg-black overflow-hidden text-center border-t border-white/10">
      {/* Mesh Gradient */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gray-700 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Floating badge (same as hero but shorter) */}
        <div
          className={`inline-flex items-center gap-2 px-5 py-2.5 mb-10 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <UserCheck className="w-4 h-4 hidden md:block" />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
            Smart Adviser Matching System
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-5xl md:text-7xl font-bold mb-8 transition-all duration-1000 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            Adviser Recommender
          </span>
          <br />
        </h1>

        {/* Description */}
        <p
          className={`md:text-xl  text-gray-300 md:max-w-xl max-w-3xl mx-auto mb-14 font-light leading-relaxed transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Get tailored adviser recommendations that match your research
          interests, thesis topic, and academic background — powered by
          intelligent matching and faculty expertise.
        </p>

        {/* Button */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/find-adviser"
            className="px-8 py-3 rounded-md font-semibold text-black bg-white hover:bg-gray-200 transition shadow-lg"
          >
            Find My Adviser
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default AdviserRecommender;
