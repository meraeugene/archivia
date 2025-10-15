/* eslint-disable @next/next/no-img-element */
import React from "react";
import { UserPlus, Users, Mail, CheckCircle, XCircle } from "lucide-react";
import { Adviser } from "@/types/advisers";
import { getInitials } from "@/utils/getInitials";

type Props = {
  adviser: Adviser;
  showAll: boolean;
  onToggleShowAll: () => void;
  onConnect: () => void;
};

const AdviserCard = ({
  adviser,
  showAll,
  onToggleShowAll,
  onConnect,
}: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/*  Only profile picture has group */}
            <div className="relative group">
              {adviser.profile_picture ? (
                <img
                  src={adviser.profile_picture}
                  alt={adviser.full_name}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                  {getInitials(adviser.full_name)}
                </div>
              )}

              {/* Hover Profile Card */}
              <div className="absolute left-14 top-0 z-20 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                {adviser.profile_picture ? (
                  <img
                    src={adviser.profile_picture}
                    alt={adviser.full_name}
                    className="w-full h-full object-cover border-b border-gray-200 rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-black flex items-center justify-center text-white font-bold text-3xl">
                    {getInitials(adviser.full_name)}
                  </div>
                )}

                <div className="px-4 pt-2 pb-4">
                  <h4 className="font-semibold text-lg text-black">
                    {adviser.full_name}
                  </h4>
                  {adviser.position && (
                    <p className="text-gray-700">{adviser.position}</p>
                  )}
                  {adviser.email && (
                    <div className="flex items-center mt-1 text-gray-600 text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{adviser.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/*  This is now separate, does not trigger hover */}
            <div>
              <h3 className="text-xl font-bold text-black">
                {adviser.full_name}
              </h3>
              <p className="text-gray-600 text-sm">{adviser.position}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm ">
            <div className="flex items-center gap-1 font-semibold">
              <Users size={14} />
              <span>{adviser.capacity} Groups Advised</span>
            </div>
            {adviser.availability === "Available" ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={16} /> Available
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <XCircle size={16} /> Unavailable
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-black mb-2">
          Research Specializations:
        </h4>
        {adviser.research_interest && (
          <div className="flex flex-wrap gap-2">
            {adviser.research_interest
              .split(",")
              .slice(0, 3)
              .map((ri, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium border border-gray-200"
                >
                  {ri.trim()}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Past Projects */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-black mb-3">
          Past Projects ({adviser.projects.length})
        </h4>
        <div className="space-y-3">
          {(showAll ? adviser.projects : adviser.projects.slice(0, 3)).map(
            (proj, i) => (
              <div
                key={i}
                className="group cursor-pointer bg-gray-50 border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-700 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-6 p-3">
                  <h5 className="flex-1 font-medium text-black text-sm leading-snug">
                    {i + 1}. {proj.title}
                  </h5>
                  <div className="flex items-center gap-1 text-xs text-black font-medium shrink-0">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    {(proj.similarity * 100).toFixed(0)}% match
                  </div>
                </div>

                {/* Dropdown abstract */}
                <div className="max-h-0 opacity-0 group-hover:max-h-[999px] group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden px-3 pb-3">
                  <p className="text-gray-700 text-justify text-sm leading-relaxed">
                    {proj.abstract || "No abstract available."}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Show More / Less */}
        {adviser.projects.length > 3 && (
          <button
            onClick={onToggleShowAll}
            className="mt-3 text-sm font-medium text-gray-500 hover:underline cursor-pointer"
          >
            {showAll
              ? "Show less"
              : `Show +${adviser.projects.length - 3} more projects`}
          </button>
        )}
      </div>

      {/* Connect Button */}
      <button
        disabled={
          adviser.availability !== "Available" || adviser.already_requested
        }
        onClick={onConnect}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-xl transition-all duration-200 
    ${
      adviser.availability !== "Available"
        ? "bg-gray-100 text-gray-500 border border-gray-100 cursor-not-allowed"
        : adviser.already_requested
        ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
        : "bg-black text-white hover:bg-black/90 cursor-pointer"
    }`}
      >
        {adviser.already_requested ? (
          <>
            <CheckCircle size={18} />
            Request Sent
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Connect with {adviser.full_name}
          </>
        )}
      </button>
    </div>
  );
};

export default AdviserCard;
