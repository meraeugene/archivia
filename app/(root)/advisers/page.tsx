"use client";

import React, { useState } from "react";
import { advisors } from "@/data/advisers";
import { BookOpen } from "lucide-react";
import { getInitials } from "@/utils/getInitials";

const AdvisorsDirectory = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-gray-50" onMouseMove={handleMouseMove}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl text-white font-extrabold mb-5 tracking-tight">
            USTP IT Faculty
          </h1>

          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto ">
            Meet our distinguished faculty members who are shaping the future of
            Information Technology education.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {advisors.map((advisor, index) => {
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                className="group cursor-pointer relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: isHovered
                    ? "scale(1.05) translateZ(20px)"
                    : "scale(1) translateZ(0px)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transformStyle: "preserve-3d",
                  zIndex: isHovered ? 50 : 1,
                }}
              >
                {/* Main Card */}
                <div
                  className="bg-gray-900 rounded-lg overflow-hidden border border-t-4 border-gray-900 "
                  style={{
                    boxShadow: isHovered
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                      : "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {/* Gradient Header */}
                  <div className="h-24 bg-gradient-to-br from-white to-gray-100 relative">
                    <div className="absolute inset-0 bg-white/30"></div>
                  </div>

                  {/* Avatar */}
                  <div className="relative -mt-8 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg border-3 border-gray-800 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700">
                        {getInitials(advisor.full_name)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-medium text-white mb-1 leading-tight ">
                      {advisor.prefix} {advisor.full_name} {advisor.suffix}
                    </h3>

                    <p className="text-xs text-gray-400 mb-2">
                      {advisor.department}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Netflix-Style Hover Popup */}
      {hoveredCard !== null && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 150,
            transform: "translateZ(100px)",
          }}
        >
          <div
            className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-80 overflow-hidden"
            style={{
              animation: "popup 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
            }}
          >
            {/* Popup Header */}
            <div className="h-20 bg-gradient-to-br border-b-2 border-white  relative">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative p-4 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {getInitials(advisors[hoveredCard].full_name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {advisors[hoveredCard].prefix}{" "}
                    {advisors[hoveredCard].full_name}{" "}
                    {advisors[hoveredCard].suffix}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {advisors[hoveredCard].email}
                  </p>
                  <p className="text-gray-200 text-xs">
                    {advisors[hoveredCard].department}
                  </p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-4">
              {/* Specializations */}
              <div className="mb-4">
                <h4 className="text-white text-xs font-semibold mb-2 flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {advisors[hoveredCard].specialization?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {advisors[hoveredCard].bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorsDirectory;
