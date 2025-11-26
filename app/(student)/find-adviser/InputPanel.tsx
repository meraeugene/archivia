"use client";

import {
  BookOpenText,
  FileText,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { StudentData, StudentDataField } from "@/types/advisers";
import { useEffect, useState } from "react";

interface InputPanelProps {
  studentData: StudentData;
  onChange: (field: StudentDataField, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasRecommendations: boolean;
}

const InputPanel = ({
  studentData,
  onChange,
  onSubmit,
  isLoading,
  hasRecommendations,
}: InputPanelProps) => {
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden px-6">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-3xl mx-auto py-16 ">
        {/* Header Section */}
        {!hasRecommendations && (
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
                AI-Powered Matching
              </span>
            </div>

            <h1
              className="text-6xl lg:text-7xl    font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight"
              style={{ lineHeight: "1.1" }}
            >
              Find Your Adviser
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto font-light">
              Match with research advisers based on your research interests and
              expertise
            </p>
          </div>
        )}

        {hasRecommendations && (
          <h2
            className={`text-4xl font-bold mb-10 text-white transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Find Your Adviser
          </h2>
        )}

        {/* Input Fields */}
        <div
          className={`space-y-8 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Research Title */}
          <div className="group/input relative">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
              <div
                className={`w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mr-3 transition-all duration-300 ${
                  focusedField === "title" ? "bg-white/20 scale-110" : ""
                }`}
              >
                <FileText size={16} className="text-white" />
              </div>
              Research Title
            </label>
            <div className="relative">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-white rounded-2xl blur-xl transition-opacity duration-300 ${
                  focusedField === "title" ? "opacity-10" : "opacity-0"
                }`}
              ></div>

              <input
                type="text"
                className="relative w-full p-3 md:p-5 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl outline-none transition-all duration-300 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/10 focus:shadow-2xl focus:shadow-white/10"
                placeholder="e.g., Exploring Machine Learning Techniques for Predictive Analytics"
                value={studentData.title}
                onChange={(e) => onChange("title", e.target.value)}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
              />

              {/* Character count */}
              {studentData.title && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {studentData.title.length}
                </div>
              )}
            </div>
          </div>

          {/* Research Overview */}
          <div className="group/input relative">
            <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
              <div
                className={`w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mr-3 transition-all duration-300 ${
                  focusedField === "abstract" ? "bg-white/20 scale-110" : ""
                }`}
              >
                <BookOpenText size={16} className="text-white" />
              </div>
              Research Overview
            </label>
            <div className="relative">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-white rounded-2xl blur-xl transition-opacity duration-300 ${
                  focusedField === "abstract" ? "opacity-10" : "opacity-0"
                }`}
              ></div>

              <textarea
                className="relative w-full  p-3 md:p-5 border border-white/10 rounded-2xl resize-none bg-white/5 backdrop-blur-xl focus:border-white/30 focus:bg-white/10 focus:shadow-2xl focus:shadow-white/10 outline-none transition-all duration-300 text-white placeholder-gray-500 scrollbar-none "
                rows={8}
                placeholder="Describe your research topic, objectives, and any specific areas of interest or methodologies you plan to use..."
                value={studentData.abstract}
                onChange={(e) => onChange("abstract", e.target.value)}
                onFocus={() => setFocusedField("abstract")}
                onBlur={() => setFocusedField(null)}
              />

              {/* Character count */}
              {studentData.abstract && (
                <div className="absolute right-4 bottom-4 text-xs text-gray-500">
                  {studentData.abstract.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isLoading || !studentData.title || !studentData.abstract}
          className={`mt-10 w-full px-8 py-3 md:py-6 rounded-2xl bg-white text-black font-bold text-lg transition-all  delay-200 duration-1000 shadow-2xl shadow-white/20 flex items-center justify-center gap-3 group/btn relative overflow-hidden ${
            isLoading || !studentData.title || !studentData.abstract
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-[1.02] hover:shadow-white/30 active:scale-95 cursor-pointer"
          } ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Shimmer effect */}
          {!isLoading && studentData.title && studentData.abstract && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
          )}

          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>Finding Advisers...</span>
            </>
          ) : (
            <>
              <span>Get Recommendations</span>
              <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>

        {/* Info Card */}
        {!hasRecommendations && (
          <div
            className={`mt-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl md:p-8 p-4  transition-all duration-1000 delay-400 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div>
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg ">
                    How it works
                  </h4>
                </div>
              </div>

              <div className="content__container mt-6">
                <p className="text-gray-400 leading-relaxed text-justify">
                  Our AI analyzes your research title and overview to match you
                  with advisers who have experience in similar projects. The
                  more detailed your input, the better the recommendations.
                </p>

                {/* Feature list */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Advanced semantic analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Expertise matching algorithm</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Personalized recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasRecommendations && (
          <div className="mt-8 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-5 text-sm text-gray-300 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-500">
            <Lightbulb
              className="text-white mt-0.5 flex-shrink-0 animate-pulse"
              size={18}
            />
            <p>
              Update your{" "}
              <span className="font-semibold text-white">
                research title and overview
              </span>{" "}
              to refine your adviser recommendations in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;
