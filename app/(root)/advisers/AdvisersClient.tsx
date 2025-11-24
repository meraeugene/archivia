/* eslint-disable @next/next/no-img-element */

"use client";
import { useState } from "react";

import { getInitials } from "@/utils/getInitials";
import { Adviser } from "@/types/advisers";
import { AdviserCard } from "./AdviserCard";
import { StudentAdviser } from "@/types/studentAdviser";
import AdviserModal from "./AdviserModal";

interface AdvisersClientProps {
  advisers: Adviser[];
  studentAdviser: StudentAdviser | null;
}

const AdvisersClient = ({ advisers, studentAdviser }: AdvisersClientProps) => {
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);

  const openModal = (adviser: Adviser) => {
    setSelectedAdviser(adviser);
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    setSelectedAdviser(null);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdviserCard adviser={studentAdviser} />

      {/* 3D Cards Grid */}
      <div className="relative">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
          <div className="relative max-w-7xl mx-auto px-6 md:py-20 py-12 text-center">
            <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-5 tracking-tight">
              USTP Advisers
            </h1>

            <div className="w-32 h-1 bg-white mx-auto md:mb-8 mb-6"></div>
            <p className=" md:text-lg text-gray-300 max-w-xl mx-auto ">
              Meet our distinguished faculty members who are shaping the future
              of research and innovation at USTP.
            </p>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0   bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>

        <div className="grid max-w-7xl mx-auto  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8  md:py-12 px-4 md:px-6 xl:px-0 ">
          {advisers.map((adviser) => (
            <div
              key={adviser.id}
              className="group cursor-pointer"
              onClick={() => openModal(adviser)}
              style={{ perspective: "1000px" }}
            >
              {/* 3D Card Container */}
              <div
                className="relative w-full h-80 transform-gpu transition-all duration-500 preserve-3d group-hover:rotateY-180"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(5deg) rotateY(5deg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "rotateX(0deg) rotateY(0deg) translateZ(20px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "rotateX(5deg) rotateY(5deg)";
                }}
              >
                {/* Front Face */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Full Container Profile Picture */}
                  <div className="relative w-full h-full overflow-hidden">
                    {adviser.profile_picture ? (
                      <img
                        src={adviser.profile_picture}
                        alt={adviser.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-6xl font-light text-white">
                          {getInitials(adviser.full_name)}
                        </span>
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-medium mb-1 leading-tight">
                        {adviser.full_name}
                      </h3>
                      {(adviser.prefix || adviser.suffix) && (
                        <p className="text-xs text-gray-300 mb-1 font-light tracking-wider uppercase">
                          {adviser.prefix} {adviser.suffix}
                        </p>
                      )}
                      <p className="text-sm text-gray-200 font-light">
                        {adviser.position}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced 3D Modal */}
      {selectedAdviser && (
        <AdviserModal
          selectedAdviser={selectedAdviser}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default AdvisersClient;
