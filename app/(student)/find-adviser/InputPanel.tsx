"use client";

import React from "react";
import { BookOpen, FileText, Lightbulb } from "lucide-react";
import { StudentData, StudentDataField } from "@/types/advisers";

type Props = {
  studentData: StudentData;
  onChange: (field: StudentDataField, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasRecommendations: boolean;
};

const InputPanel = ({
  studentData,
  onChange,
  onSubmit,
  isLoading,
  hasRecommendations,
}: Props) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        hasRecommendations
          ? "w-2/5 border-r border-gray-200"
          : "w-full flex items-center justify-center pt-10 pb-16"
      }`}
    >
      <div
        className={`${
          hasRecommendations
            ? "top-[65px] self-start sticky h-fit py-8 pr-8 px-5"
            : "w-full max-w-2xl"
        }`}
      >
        {!hasRecommendations && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-3">
              Find Your Adviser
            </h1>
            <p className="text-gray-600">
              Match with research mentors based on your thesis topic and
              research overview
            </p>
          </div>
        )}

        {hasRecommendations && (
          <h2 className="text-3xl font-bold text-black mb-6">
            Find Your Adviser
          </h2>
        )}

        <div className="space-y-6">
          {/* Thesis Title */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <BookOpen className="mr-2" size={20} />
              Thesis Title
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-black outline-none transition-all duration-200 text-black placeholder-gray-400"
              placeholder="e.g., Predictive Models for Crop Yield Optimization"
              value={studentData.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          {/* Abstract */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <FileText className="mr-2" size={20} />
              Research Overview
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl resize-none bg-white focus:ring-2 focus:ring-black outline-none transition-all duration-200 text-black placeholder-gray-400"
              rows={hasRecommendations ? 10 : 6}
              placeholder="Describe your research topic, objectives, and any specific areas of interest or methodologies you plan to use."
              value={studentData.abstract}
              onChange={(e) => onChange("abstract", e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-8 w-full px-6 py-4 rounded-xl bg-black text-white font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 hover:bg-black/90 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Finding Advisers...
            </>
          ) : (
            <>Get Recommendations</>
          )}
        </button>

        {!hasRecommendations && (
          <div className="mt-8 p-6 border border-gray-200 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Lightbulb className="text-black mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-black mb-2">How it works</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our AI Model analyzes your research topic and overview to
                  match you with advisers who have experience in similar
                  projects. The more detailed your description, the better the
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasRecommendations && (
          <div className="mt-8 p-4 border border-blue-100 bg-blue-50 rounded-lg text-sm text-gray-800 flex items-start gap-2">
            <Lightbulb className="text-blue-600 mt-0.5" size={18} />
            <p>
              Start typing your{" "}
              <span className="font-medium">
                thesis title, research overview
              </span>{" "}
              to see your recommended advisers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;
