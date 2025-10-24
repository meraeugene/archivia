/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Mail,
  GraduationCap,
  BookOpen,
  Book,
  ExternalLink,
} from "lucide-react";

import { StudentAdviser } from "@/types/studentAdviser";
import { getInitials } from "@/utils/getInitials";

export const AdviserCard = ({
  adviser,
}: {
  adviser: StudentAdviser | null;
}) => {
  if (!adviser) return null;

  return (
    <div className="bg-white ">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl text-white font-extrabold mb-5 tracking-tight">
            My Adviser
          </h1>

          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-xl mx-auto ">
            Here is the detailed information about your assigned academic
            adviser.
          </p>
        </div>
      </div>

      <div className="py-12 px-24  flex items-center justify-center">
        <div className="max-w-8xl w-full">
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 border rounded-xl overflow-hidden border-gray-300">
            {/* COLUMN 1 - Image */}
            <div className="flex border-b-2 lg:border-b-0 lg:border-r border-gray-300 ">
              <div className="w-full">
                {adviser.profile_picture ? (
                  <img
                    src={adviser.profile_picture}
                    alt={adviser.full_name}
                    className="w-full h-full object-cover  border-white"
                  />
                ) : (
                  <div className="w-full h-full bg-white border-4 border-white flex items-center justify-center">
                    <span className="text-8xl font-bold text-black">
                      {getInitials(adviser.full_name)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2 - Information */}
            <div className="bg-white p-8 md:p-10 border-b-2 lg:border-b-0 lg:border-r border-gray-300">
              {/* Name & Title */}
              <div className="mb-8 pb-6 border-b border-gray-300">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                  {adviser.full_name}
                </h1>
                {(adviser.prefix || adviser.suffix) && (
                  <p className="text-sm text-gray-600 mb-3">
                    {[adviser.prefix, adviser.suffix]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <p className="text-base text-gray-800 mb-4">
                  {adviser.position}
                </p>
                <a
                  href={`mailto:${adviser.email}`}
                  className="inline-flex items-center gap-2 text-black hover:text-gray-600 transition-colors text-sm"
                >
                  <Mail size={16} />
                  <span className="underline">{adviser.email}</span>
                </a>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                  <GraduationCap size={16} />
                  Education
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {adviser.highest_educational_attainment}
                </p>
              </div>

              {/* Research Interests */}
              {adviser.research_interest && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {adviser.research_interest
                      .split(",")
                      .map((interest: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-black text-white px-3 py-1.5 text-xs"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {adviser.handled_subjects && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Book size={16} />
                    Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {adviser.handled_subjects
                      .split(",")
                      .map((subject: string, idx: number) => (
                        <span
                          key={idx}
                          className="border-2 border-black text-black px-3 py-1.5 text-xs"
                        >
                          {subject.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* ORCID */}
              {adviser.orcid && (
                <div>
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ExternalLink size={16} />
                    ORCID
                  </h3>
                  {adviser.orcid === "To be provided" ? (
                    <p className="text-gray-500 italic text-sm">
                      To be provided
                    </p>
                  ) : (
                    <a
                      href={`https://orcid.org/${adviser.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-black hover:text-gray-600 transition-colors underline text-sm"
                    >
                      {adviser.orcid}
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* COLUMN 3 - Biography */}
            <div className="bg-white p-8 md:p-10">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-6 pb-3 border-b border-gray-300">
                Biography
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {adviser.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
