"use client";
import { Adviser } from "@/types/advisers";
import { getInitials } from "@/utils/getInitials";
import { CheckCircle2, Zap } from "lucide-react";

const AdviserThumbnail = ({
  adviser,
  onClick,
}: {
  adviser: Adviser;
  onClick: () => void;
}) => {
  return (
    <div onClick={onClick} className="group cursor-pointer relative">
      <div className="relative aspect-square bg-black shadow-xl hover:shadow-2xl overflow-hidden transform transition-all duration-300 group-hover:scale-105">
        {adviser.profile_picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={adviser.profile_picture}
            alt={adviser.full_name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-6xl font-bold text-white group-hover:text-gray-500 transition-colors duration-300">
              {getInitials(adviser.full_name)}
            </span>
          </div>
        )}

        {adviser.already_requested && (
          <div className="absolute top-3 right-3 bg-white p-2 z-10 shadow-lg">
            <CheckCircle2 size={20} className="text-black" />
          </div>
        )}

        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gray-50 "></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gray-50 "></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-base mb-1 border-l-4 border-white pl-2">
              {adviser.full_name}
            </h3>
            <p className="text-gray-300 text-xs mb-2">{adviser.position}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-white" />
                <span className="text-xs text-white">Click to view</span>
              </div>
              <div className="bg-white text-black px-2 py-1 text-xs font-bold shadow-md">
                {adviser.current_leaders}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviserThumbnail;
