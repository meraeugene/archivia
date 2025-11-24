/* eslint-disable @next/next/no-img-element */
"use client";
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
interface AdviserModalProps {
  selectedAdviser: Adviser;
  closeModal: () => void;
}

const AdviserModal = ({ selectedAdviser, closeModal }: AdviserModalProps) => {
  return (
    <div
      className="fixed  inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop-blur-sm px-4 "
      onClick={closeModal}
    >
      <button
        onClick={closeModal}
        className="absolute top-20 right-8 z-50 cursor-pointer 
      text-gray-600 hover:text-black xl:hidden transition-colors"
      >
        <X size={24} />
      </button>

      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-7xl overflow-auto max-h-[85vh] relative animate-fadeInScale scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute hidden top-4 right-4 z-10    text-gray-700 rounded-full xl:flex items-center justify-center hover:text-gray-900 cursor-pointer"
        >
          <X className="w-8 h-8" />
        </button>

        <div
          className="    grid grid-cols-1
  md:grid-cols-10
  lg:grid-cols-12
  xl:grid-cols-12
  2xl:grid-cols-13
  h-full"
        >
          {/* Left Side (40%) */}
          <div
            className="  md:col-span-10
      lg:col-span-7
      xl:col-span-6
      2xl:col-span-5
      relative overflow-hidden
      order-1"
          >
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

          {/* Right Content  */}
          <div
            className="  md:col-span-10
      lg:col-span-5
      xl:col-span-6
      2xl:col-span-4
      p-6 overflow-y-auto
      order-2"
          >
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
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

            {/* Research Interests */}
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
                        className="bg-gray-800 text-white w-fit border text-sm px-4 py-3 rounded border-l-4 border-l-blue-200 transform hover:translate-x-1 transition-transform duration-200"
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
                          className="bg-gray-800 text-white w-fit border text-sm px-4 py-3 rounded border-l-4 border-l-blue-200 transform hover:translate-x-1 transition-transform duration-200"
                        >
                          {spec.trim()}
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* ORCID */}
            {selectedAdviser.orcid && (
              <div>
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
          <div
            className="
      md:col-span-10        
      lg:col-span-12        
      xl:col-span-12        
      2xl:col-span-4
      p-6 pt-2 md:pt-8 md:pb-6 overflow-y-auto
      
      order-3             
      xl:order-3           
    "
          >
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
  );
};

export default AdviserModal;
