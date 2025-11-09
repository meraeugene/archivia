"use client";

import { Mail, X, CheckCircle2, Target } from "lucide-react";
import { Adviser } from "@/types/advisers";
import { getInitials } from "@/utils/getInitials";

const AdviserProfileCard = ({
  adviser,
  onClose,
  onConnect,
}: {
  adviser: Adviser;
  onClose: () => void;
  onConnect: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white   animate-fadeInScale max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-50 shadow-xs border-gray-100 border-b text-black py-4 px-12 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-10 w-10 h-10 text-gray-800 cursor-pointer flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:text-gray-900 hover:bg-gray-200 rounded-full"
          >
            <X size={28} />
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Adviser Profile
            </h2>
          </div>
        </div>

        <div className="p-12 space-y-12">
          {/* TOP SECTION - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT COLUMN - Profile Info */}
            <div className="space-y-6">
              {/* Profile Image with Overlayed Name */}
              <div className="relative w-full aspect-square shadow-2xl  overflow-hidden">
                {adviser.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={adviser.profile_picture}
                    alt={adviser.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <span className="text-8xl font-bold text-white">
                      {getInitials(adviser.full_name)}
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute bottom-0 w-full bg-black/40 text-white p-5 backdrop-blur-sm flex flex-col gap-4 ">
                  {/* Left Side: Name + Position */}
                  <div>
                    <h3 className="text-2xl font-extrabold leading-tight">
                      {adviser.full_name}
                    </h3>
                    {(adviser.prefix || adviser.suffix) && (
                      <p className="text-xs text-gray-300 mb-1">
                        {[adviser.prefix, adviser.suffix]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-200">{adviser.position}</p>
                  </div>

                  {/* Right Side: Availability & Advisees */}
                  <div className="flex  items-end gap-2 text-right">
                    {/* Availability */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        adviser.availability === "Available"
                          ? "bg-green-400 text-black"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {adviser.availability}
                    </span>

                    {/* Advisees Count */}
                    <span className="px-3 py-1 rounded-full bg-gray-600 text-white text-xs font-bold">
                      {adviser.current_leaders} Advisee
                      {adviser.current_leaders !== 1 && "s"}
                    </span>

                    {/* Email Icon */}
                    {adviser.email && (
                      <a
                        href={`mailto:${adviser.email}`}
                        className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center transition-colors duration-200 hover:bg-gray-700 hover:text-white"
                        title="Contact Adviser"
                      >
                        <Mail size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Details */}
            <div className="space-y-8">
              {adviser.bio && (
                <div className=" border border-gray-50  ">
                  <h4 className=" text-lg  font-extrabold  mb-4  ">
                    BIOGRAPHY
                  </h4>
                  <p className="  text-gray-700 leading-relaxed">
                    {adviser.bio}
                  </p>
                </div>
              )}

              {adviser.research_interest && (
                <div className="bg-white   border border-gray-50 ">
                  <h4 className="text-lg   font-extrabold  mb-4 ">
                    RESEARCH INTERESTS
                  </h4>
                  <div className="flex flex-wrap gap-4 ">
                    {adviser.research_interest
                      .split(",")
                      .map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-2  font-bold shadow-md"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={onConnect}
                disabled={adviser.already_requested}
                className={`w-full mt-4   py-4 font-extrabold text-lg ${
                  adviser.already_requested
                    ? "bg-green-100  text-green-700 border  border-green-300 cursor-not-allowed"
                    : "bg-black hover:bg-black/90 cursor-pointer  text-white "
                }`}
              >
                {adviser.already_requested ? (
                  <div className="flex items-center justify-center  gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    REQUEST SENT
                  </div>
                ) : (
                  "REQUEST AS ADVISER"
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM SECTION - Past Projects (1 column) */}
          <div>
            <div className=" mb-6">
              <h4 className="text-xl font-extrabold ">PAST PROJECTS</h4>
            </div>

            {adviser.projects && adviser.projects.length > 0 ? (
              <div className="grid grid-cols-2 gap-8">
                {adviser.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-black via-gray-900 to-black p-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        PROJECT {idx + 1}
                      </span>
                      <div className="bg-white text-black px-3 py-1 text-xs font-bold shadow-md">
                        {Math.round(project.similarity * 100)}% MATCH
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-extrabold text-lg uppercase text-black mb-3 leading-tight">
                        {project.title}
                      </h5>
                      <p className=" text-gray-600 leading-relaxed line-clamp-4">
                        {project.abstract}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white shadow-lg">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-bold">
                  NO MATCHES FOUND
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviserProfileCard;
