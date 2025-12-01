"use client";

import { BarChart3, X } from "lucide-react";
import { RecommendedAdvisersAnalysis } from "./RecommendedAdvisersAnalysis";

interface GraphModalProps {
  radarData: {
    name: string;
    similarity: number;
    experience: number;
    overall: number;
    top_project: {
      title: string;
      similarity: number;
    };
  }[];
  onClose: () => void;
}

const GraphModal = ({ radarData, onClose }: GraphModalProps) => {
  return (
    <div
      className="fixed  inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 md:p-4  "
      onClick={onClose}
    >
      <div
        className={`bg-black border border-white/10  max-w-7xl w-full h-full md:max-h-[95vh] overflow-y-auto shadow-2xl shadow-white/5 transition-all duration-500 scrollbar-none animate-fadeInScale`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-2xl bg-black/80 border-b border-white/10 md:py-6 py-4 px-6 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Adviser Matching Analysis
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

        {/* Content */}
        <div className="p-6 md:p-12 space-y-12">
          <RecommendedAdvisersAnalysis advisers={radarData} />
        </div>
      </div>
    </div>
  );
};

export default GraphModal;
