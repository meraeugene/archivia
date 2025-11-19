"use client";

import {
  Mail,
  X,
  CheckCircle2,
  Target,
  Sparkles,
  Award,
  BookOpen,
} from "lucide-react";
import { Adviser } from "@/types/advisers";
import { motion } from "framer-motion";
import { getInitials } from "@/utils/getInitials";
import { useEffect, useState } from "react";

const AdviserProfileCard = ({
  adviser,
  onClose,
  onConnect,
}: {
  adviser: Adviser;
  onClose: () => void;
  onConnect: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleProject = (idx: number) => {
    setExpandedProjects((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={`bg-black border border-white/10  max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl shadow-white/5 transition-all duration-500 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-2xl bg-black/80 border-b border-white/10 py-6 px-8 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Adviser Profile
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 text-white backdrop-blur-xl bg-white/10 border border-white/20 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 active:scale-95 rounded-2xl"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-12">
          {/* TOP SECTION - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* LEFT COLUMN - Profile Image */}
            <div className="relative group">
              <div className="relative aspect-square rounded-[28px] overflow-hidden shadow-2xl shadow-white/10 border border-white/10">
                {adviser.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={adviser.profile_picture}
                    alt={adviser.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                    <span className="text-7xl md:text-8xl font-bold text-white">
                      {getInitials(adviser.full_name)}
                    </span>
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 w-full b p-6 space-y-4">
                  {/* Name & Title */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                      {adviser.full_name}
                    </h3>
                    {(adviser.prefix || adviser.suffix) && (
                      <p className="text-xs text-gray-400 mb-2">
                        {[adviser.prefix, adviser.suffix]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-300">{adviser.position}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Availability */}
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                        adviser.availability === "Available"
                          ? "bg-green-400 text-black"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {adviser.availability}
                    </span>

                    {/* Advisees Count */}
                    <span className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 text-white text-xs font-bold">
                      {adviser.current_leaders} Advisee
                      {adviser.current_leaders !== 1 && "s"}
                    </span>

                    {/* Email Button */}
                    {adviser.email && (
                      <a
                        href={`mailto:${adviser.email}`}
                        className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold flex items-center gap-2 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 shadow-lg"
                        title="Contact Adviser"
                      >
                        <Mail size={14} />
                        <span>Contact</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Details */}
            <div className="space-y-6">
              {/* Biography */}
              {adviser.bio && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="text-white" size={16} />
                    </div>
                    <h4 className="text-lg font-bold text-white">Biography</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{adviser.bio}</p>
                </div>
              )}

              {/* Research Interests */}
              {adviser.research_interest && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="text-white" size={16} />
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      Research Interests
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {adviser.research_interest
                      .split(",")
                      .map((interest, idx) => (
                        <span
                          key={idx}
                          className="backdrop-blur-xl bg-white text-black px-4 py-2 rounded-full font-semibold text-sm shadow-lg hover:scale-105 transition-transform duration-300 cursor-default"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={onConnect}
                disabled={adviser.already_requested}
                className={`group/btn w-full py-5 font-bold text-lg rounded-2xl transition-all duration-500 shadow-2xl relative overflow-hidden ${
                  adviser.already_requested
                    ? "backdrop-blur-xl bg-green-500/20 border border-green-500/30 text-green-400 cursor-not-allowed"
                    : "bg-white text-black hover:scale-[1.02] active:scale-95 cursor-pointer hover:shadow-white/30"
                }`}
              >
                {/* Shimmer effect for active button */}
                {!adviser.already_requested && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                )}

                {adviser.already_requested ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 size={22} className="text-green-400" />
                    Request Sent
                  </div>
                ) : (
                  "Request as Adviser"
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM SECTION - Past Projects */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h4 className="text-2xl font-bold text-white">Past Projects</h4>
            </div>

            {adviser.projects && adviser.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adviser.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="group/project relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl  overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/project:opacity-5 transition-opacity duration-500"></div>

                    {/* Header with Match */}
                    <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/10 p-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        Project {idx + 1}
                      </span>
                      <div className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        {Math.round(project.similarity * 100)}% Match
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6 space-y-3">
                      <h5 className="font-bold text-lg text-white leading-tight">
                        {project.title}
                      </h5>
                      <motion.div
                        initial={{ height: 100 }}
                        animate={{
                          height: expandedProjects.includes(idx) ? "auto" : 100,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 leading-relaxed">
                          {project.abstract}
                        </p>
                      </motion.div>
                      <button
                        onClick={() => toggleProject(idx)}
                        className="cursor-pointer text-sm text-blue-400 font-semibold mt-2 hover:underline"
                      >
                        {expandedProjects.includes(idx)
                          ? "Show Less"
                          : "Show More"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl py-16 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="text-gray-500" size={32} />
                </div>
                <p className="text-gray-400 font-semibold">
                  No project matches found
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
