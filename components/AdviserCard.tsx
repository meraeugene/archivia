import React from "react";
import { UserPlus, Users, Clock } from "lucide-react";
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
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
              {getInitials(adviser.adviser)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">
                {adviser.adviser}
              </h3>
              <p className="text-gray-600 text-sm">CITC Department</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{adviser.capacity} groups</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-black mb-2">
          Research Specializations:
        </h4>
        <div className="flex flex-wrap gap-2">
          {["Machine Learning", "Data Science", "Agricultural Tech"].map(
            (spec, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-black rounded-full text-xs font-medium border border-gray-200"
              >
                {spec}
              </span>
            )
          )}
        </div>
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
        onClick={onConnect}
        className="w-full flex items-center justify-center gap-2 bg-black text-white cursor-pointer hover:bg-black/90 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
      >
        <UserPlus size={18} />
        Connect with {adviser.adviser}
      </button>
    </div>
  );
};

export default AdviserCard;
