/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  BookOpen,
  X,
  Mail,
  GraduationCap,
  Book,
  LinkIcon,
  FileText,
} from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { Adviser } from "@/types/advisers";
import { AdviserCard } from "./AdviserCard";
import { StudentAdviser } from "@/types/studentAdviser";

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
    <div className="min-h-screen bg-white">
      <AdviserCard adviser={studentAdviser} />

      {/* 3D Cards Grid */}
      <div className="">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl text-white font-extrabold mb-5 tracking-tight">
              USTP Advisers
            </h1>

            <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-xl mx-auto ">
              Meet our distinguished faculty members who are shaping the future
              of research and innovation at USTP.
            </p>
          </div>
        </div>

        <div className="grid max-w-7xl mx-auto  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8  py-12 ">
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop-blur-sm "
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-7xl overflow-auto max-h-[90vh] relative "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side - Large Profile Picture */}
              <div className="md:w-[40%] h-64 md:h-auto relative overflow-hidden">
                {selectedAdviser.profile_picture ? (
                  <img
                    src={selectedAdviser.profile_picture}
                    alt={selectedAdviser.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-8xl font-light text-white">
                      {getInitials(selectedAdviser.full_name)}
                    </span>
                  </div>
                )}

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
              </div>

              {/* Right Side - Content */}
              <div className="md:w-[30%] p-6 pr-0 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-3xl font-light text-gray-900 mb-2">
                    {selectedAdviser.full_name}
                  </h3>
                  {(selectedAdviser.prefix || selectedAdviser.suffix) && (
                    <p className="text-sm text-gray-500 mb-2 font-light tracking-wider uppercase">
                      {selectedAdviser.prefix} {selectedAdviser.suffix}
                    </p>
                  )}
                  <p className="text-gray-700 font-medium mb-4">
                    {selectedAdviser.position}
                  </p>

                  {selectedAdviser.email && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{selectedAdviser.email}</span>
                    </div>
                  )}
                </div>

                {/* Highest Educational Attainment */}
                {selectedAdviser.highest_educational_attainment && (
                  <div className="mb-8">
                    <h4 className="text-gray-900 text-sm font-medium mb-4 uppercase tracking-wider flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Highest Educational Attainment
                    </h4>
                    <p className="text-gray-700">
                      {selectedAdviser.highest_educational_attainment}
                    </p>
                  </div>
                )}

                {selectedAdviser.research_interest && (
                  <div className="mb-8">
                    <h4 className="text-gray-900 text-sm font-medium mb-4 uppercase tracking-wider flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Research Interests
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedAdviser.research_interest
                        .split(",")
                        .map((spec, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-800 text-white w-fit  border text-sm px-4 py-3 rounded border-l-4 border-l-blue-200  transform hover:translateX-1 transition-transform duration-200"
                          >
                            {spec.trim()}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Handled Subjects */}
                {selectedAdviser.handled_subjects &&
                  selectedAdviser.handled_subjects.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-gray-900 text-sm font-medium mb-4 uppercase tracking-wider flex items-center">
                        <Book className="w-4 h-4 mr-2" />
                        Handled Subjects
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedAdviser.handled_subjects
                          .split(",")
                          .map((spec, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-800 text-white w-fit  border text-sm px-4 py-3 rounded border-l-4 border-l-blue-200  transform hover:translateX-1 transition-transform duration-200"
                            >
                              {spec.trim()}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* ORCID */}
                {selectedAdviser.orcid && (
                  <div className="mb-8">
                    <h4 className="text-gray-900 text-sm font-medium mb-4 uppercase tracking-wider flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      ORCID
                    </h4>
                    {selectedAdviser.orcid === "To be provided" ? (
                      <span>To be provided</span>
                    ) : (
                      <a
                        href={`https://orcid.org/${selectedAdviser.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {selectedAdviser.orcid}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Biography */}
              <div className="md:w-[30%] p-6 pt-24 overflow-y-auto">
                {selectedAdviser.bio && (
                  <div>
                    <h4 className="text-gray-900 text-sm font-medium mb-4 uppercase tracking-wider flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Biography
                    </h4>
                    <p className="text-gray-700 leading-relaxed line-clamp-25">
                      {selectedAdviser.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisersClient;
