"use client";

import { Adviser } from "@/types/advisers";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import AdviserProfileCard from "./AdviserProfileCard";
import AdviserThumbnail from "./AdviserThumbnail";
import { RefreshCw, Sparkles, Award, Grid3x3, Triangle } from "lucide-react";

interface RecommendationsListProps {
  recommendations: Adviser[];
  onConnect: (adviser: Adviser) => void;
  wildcardAdvisers: Adviser[];
  handleReset: () => void;
}

export const RecommendationsList = ({
  recommendations,
  onConnect,
  wildcardAdvisers,
  handleReset,
}: RecommendationsListProps) => {
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [layoutMode, setLayoutMode] = useState<"pyramid" | "grid">("pyramid");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Motion variants for cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 14,
        mass: 0.8,
        duration: 1.5,
      },
    },
  };

  // Container variant to stagger children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const pyramidRows: Adviser[][] = [];
  let i = 0;
  let rowSize = 1;

  while (i < recommendations.length) {
    pyramidRows.push(recommendations.slice(i, i + rowSize));
    i += rowSize;
    rowSize++;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-[15%] right-[35%] w-[600px] h-[600px] bg-white rounded-full blur-[150px] animate-pulse"
          style={{
            transform: `translate(${cursorPos.x * 0.02}px, ${
              cursorPos.y * 0.02
            }px)`,
            transition: "transform 0.5s ease-out",
          }}
        ></div>
        <div
          className="absolute bottom-40 left-[40%] w-[500px] h-[500px] bg-gray-400 rounded-full blur-[120px] animate-pulse"
          style={{
            transform: `translate(${-cursorPos.x * 0.015}px, ${
              -cursorPos.y * 0.015
            }px)`,
            transition: "transform 0.5s ease-out",
            animationDelay: "1.5s",
          }}
        ></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-6xl mx-auto pb-20 pt-12 ">
        {/* Header with Reset Button */}
        <div
          className={`flex items-end justify-between mb-16 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
                AI-Matched Results
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
              Your Matches
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Layout Toggle Buttons */}
            <div className="flex backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-1.5 gap-1.5">
              <button
                onClick={() => setLayoutMode("pyramid")}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  layoutMode === "pyramid"
                    ? "bg-white text-black shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Triangle size={16} />
                <span>Pyramid</span>
              </button>
              <button
                onClick={() => setLayoutMode("grid")}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  layoutMode === "grid"
                    ? "bg-white text-black shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Grid3x3 size={16} />
                <span>Grid</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="group/btn backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-3.5 font-semibold text-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-white/10"
            >
              <RefreshCw
                size={18}
                className="group-hover/btn:rotate-180 transition-transform duration-500"
              />
              <span>New Search</span>
            </button>
          </div>
        </div>

        {/* Keywords Section */}
        {/* <div
          className={`mb-16 transition-all duration-1000 delay-150 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-white" size={20} />
              <h3 className="text-xl font-bold text-white">Match Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "Machine Learning",
                "Natural Language Processing",
                "Computer Vision",
                "Deep Learning",
                "Neural Networks",
                "AI Ethics",
                "Data Science",
              ].map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div> */}

        {/* Recommended Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Recommended
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Best matches for your research
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="backdrop-blur-xl bg-white text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-2xl shadow-white/20">
                {recommendations.length}{" "}
                {recommendations.length === 1 ? "MATCH" : "MATCHES"}
              </div>
            </div>
          </div>

          {layoutMode === "pyramid" ? (
            <motion.div
              className="flex flex-col items-center gap-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {pyramidRows.map((row, rowIndex) => {
                // const globalRank =
                //   pyramidRows
                //     .slice(0, rowIndex)
                //     .reduce((sum, r) => sum + r.length, 0) +
                //   rowIndex +
                //   1;

                return (
                  <div
                    key={rowIndex}
                    className={`flex w-full ${
                      rowIndex === pyramidRows.length - 1
                        ? "justify-center gap-10" // last row → full width
                        : "justify-center gap-10" // other rows → centered
                    }`}
                  >
                    {row.map((adviser, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        className="group/card relative"
                      >
                        <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                        <div
                          //   className={`relative max-w-[450px] backdrop-blur-xl rounded-3xl p-6 transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
                          //     globalRank === 1
                          //       ? "bg-yellow-200/90 border-yellow-300 hover:bg-yellow-200/60 hover:border-yellow-400 hover:shadow-yellow-300/50"
                          //       : globalRank === 2 || globalRank === 3
                          //       ? "bg-gray-200/90 border-gray-300 hover:bg-gray-200/60 hover:border-gray-400 hover:shadow-gray-300/50"
                          //       : globalRank === 4 || globalRank === 5
                          //       ? " hover:border-amber-400 hover:shadow-amber-300/50"
                          //       : "bg-amber-200/40 border-amber-300 hover:bg-amber-200/40 hover:border-amber-400 hover:shadow-amber-300/50"
                          //   }
                          // `}
                          className="relative max-w-[450px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
                          onClick={() => {
                            setSelectedAdviser(adviser);
                            document.body.classList.add("modal-open");
                          }}
                        >
                          {/* Rank Number Badge */}
                          {/* <div className="absolute top-4 left-4 backdrop-blur-xl bg-white text-black rounded-xl px-3 py-1.5 font-bold text-sm shadow-lg z-10">
                          #
                          {rowIndex === 0
                            ? index + 1
                            : pyramidRows
                                .slice(0, rowIndex)
                                .reduce((sum, r) => sum + r.length, 0) +
                              index +
                              1}
                        </div> */}
                          <AdviserThumbnail
                            adviser={adviser}
                            onClick={() => {}}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {recommendations.map((adviser, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="group/card relative"
                >
                  <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                  <div
                    className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
                    onClick={() => {
                      setSelectedAdviser(adviser);
                      document.body.classList.add("modal-open");
                    }}
                  >
                    {/* Rank Number Badge */}
                    {/* <div className="absolute top-4 left-4 backdrop-blur-xl bg-white text-black rounded-xl px-3 py-1.5 font-bold text-sm shadow-lg z-10">
                      #{index + 1}
                    </div> */}
                    <AdviserThumbnail adviser={adviser} onClick={() => {}} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Wildcard Section */}
        <div
          className={`transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="text-white animate-pulse" size={24} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Wildcard
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Explore these advisers align with their research interests.
                </p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-2xl shadow-white/20">
              {wildcardAdvisers.length}{" "}
              {/* {wildcardAdvisers.length === 1 ? "OPTION" : "OPTIONS"} */}
              Interest Matches
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {wildcardAdvisers.map((adviser, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group/card relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                <div
                  className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
                  onClick={() => {
                    setSelectedAdviser(adviser);
                    document.body.classList.add("modal-open");
                  }}
                >
                  <AdviserThumbnail adviser={adviser} onClick={() => {}} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Empty State for Wildcards */}
        {wildcardAdvisers.length === 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-400 text-lg">
              No wildcard matches available at this time
            </p>
          </div>
        )}
      </div>

      {selectedAdviser && (
        <AdviserProfileCard
          adviser={selectedAdviser}
          onClose={() => {
            setSelectedAdviser(null);
            document.body.classList.remove("modal-open");
          }}
          onConnect={() => onConnect(selectedAdviser)}
        />
      )}
    </div>
  );
};
