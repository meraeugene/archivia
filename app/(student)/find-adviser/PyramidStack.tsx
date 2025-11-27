"use client";

import { Award } from "lucide-react";
import AdviserThumbnail from "./AdviserThumbnail";
import { motion, Variants } from "framer-motion";
import { Adviser } from "@/types/advisers";

interface PyramidStackProps {
  cardVariants: Variants;
  containerVariants: Variants;
  setSelectedAdviser: (adviser: Adviser) => void;
  recommendations: Adviser[];
}

const PyramidStack = ({
  cardVariants,
  containerVariants,
  setSelectedAdviser,
  recommendations,
}: PyramidStackProps) => {
  const pyramidRows: Adviser[][] = [];
  let i = 0;
  let rowSize = 1;

  while (i < recommendations.length) {
    pyramidRows.push(recommendations.slice(i, i + rowSize));
    i += rowSize;
    rowSize++;
  }

  return (
    <motion.div
      className="hidden md:flex flex-col items-center gap-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {pyramidRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-10 w-full">
          {row.map((adviser, index) => {
            const globalIndex =
              pyramidRows
                .slice(0, rowIndex)
                .reduce((sum, r) => sum + r.length, 0) + index;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group/card relative"
              >
                {globalIndex === 0 && (
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-2xl px-4 py-2 font-bold text-sm flex items-center gap-2 z-20 shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 10px #fff",
                        "0 0 20px #fff",
                        "0 0 10px #fff",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <Award size={16} />
                    <span>BEST MATCH</span>
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                <div
                  className="relative max-w-[450px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
                  onClick={() => {
                    setSelectedAdviser(adviser);
                    document.body.style.overflow = "hidden";
                  }}
                >
                  <AdviserThumbnail adviser={adviser} onClick={() => {}} />
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
};

export default PyramidStack;
