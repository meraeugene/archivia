"use client";

import { useEffect, useState } from "react";
import { Archive } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-gray-700 rounded-full blur-[120px] animate-pulse"
          style={{
            transition: "transform 0.5s ease-out",
            animationDelay: "1.5s",
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6   text-center z-10">
        {/* Floating badge */}
        <div
          className={`inline-flex  items-center gap-2 px-5 py-2.5 mb-10 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Archive className="w-4 h-4 hidden md:block" />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
            University of Science and Technology of Southern Philippines
          </span>
        </div>

        {/* Main heading with gradient */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 transition-all duration-1000 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ lineHeight: "1.1" }}
        >
          <span className="bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            Digital Thesis
          </span>
          <br />
          <span className="bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            Archive
          </span>
        </h1>

        {/* Animated divider */}
        <div
          className={`relative w-32 h-1 mx-auto mb-10 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>

        {/* Description */}
        <p
          className={`text-xl md:text-2xl text-gray-300 md:max-w-xl max-w-3xl mx-auto mb-20 font-light leading-relaxed transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Discover, explore, and access a growing collection of academic
          research and scholarly excellence.
        </p>

        {/* Scroll indicator */}
        <Link
          href="#theses"
          className={`mt-20  transition-all duration-1000 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="group inline-block cursor-pointer  text-gray-500 transition-all duration-300 hover:text-gray-300 ">
            <span className="text-sm  font-medium group-hover:text-white transition-colors duration-300">
              Explore More
            </span>

            <div
              className="w-6 mx-auto mt-3 h-10 border-2 border-gray-500 rounded-full flex justify-center p-2 animate-bounce
    transition-all duration-300
    group-hover:border-white
    group-hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]
    group-hover:ring-2
    group-hover:ring-white/40"
            >
              <div
                className="w-1 h-3 bg-gray-500 rounded-full animate-pulse
      transition-all duration-300
      group-hover:bg-white
      group-hover:shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Hero;
