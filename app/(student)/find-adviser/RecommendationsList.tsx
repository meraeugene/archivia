"use client";

import { Adviser } from "@/types/advisers";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import AdviserProfileCard from "./AdviserProfileCard";
import AdviserThumbnail from "./AdviserThumbnail";
import { RefreshCw } from "lucide-react";

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

  // Motion variants for cards - classy fade + slide
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
        duration: 1.5, // slower, smooth appearance
      },
    },
  };

  // Container variant to stagger children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto pb-12 pt-8 ">
        <button
          onClick={handleReset}
          className="bg-gray-900 text-white rounded-sm px-6 py-3 font-bold text-sm shadow-md hover:bg-gray-800 transition cursor-pointer mb-8 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Find Adviser Again
        </button>

        {/* Recommended Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-extrabold text-black">Recommended</h2>
            <div className="bg-black/90 text-white rounded-sm px-6 py-3 font-bold text-sm shadow-xl">
              {recommendations.length} FOUND
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {recommendations.map((adviser, index) => (
              <motion.div key={index} variants={cardVariants}>
                <AdviserThumbnail
                  adviser={adviser}
                  onClick={() => {
                    setSelectedAdviser(adviser);
                    document.body.classList.add("modal-open");
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wildcard Section */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-extrabold text-black">Wildcard</h2>
            <div className="bg-black/90 rounded-sm text-white px-6 py-3 font-bold text-sm shadow-xl">
              {wildcardAdvisers.length} FOUND
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {wildcardAdvisers.map((adviser, index) => (
              <motion.div key={index} variants={cardVariants}>
                <AdviserThumbnail
                  adviser={adviser}
                  onClick={() => {
                    setSelectedAdviser(adviser);
                    document.body.classList.add("modal-open");
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
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
