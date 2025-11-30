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
                {/*  TOP 1 BEST MATCH BADGE */}
                {globalIndex === 0 && (
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-2xl px-4 py-2 font-bold text-sm flex items-center gap-2 z-20 shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 10px #fff",
                        "0 0 25px #fff",
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

                {/*  TOP 1 GLOWING AURA */}
                {globalIndex === 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-white/40 blur-3xl z-0"
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/*  NORMAL HOVER GLOW */}
                <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                {/*  CARD BODY */}
                <div
                  className={`relative z-10 max-w-[450px] backdrop-blur-xl bg-white/5 border rounded-3xl p-6 transition-all duration-500 cursor-pointer hover:scale-[1.02]
      ${
        globalIndex === 0
          ? "border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.35)]"
          : "border-white/10 hover:bg-white/10 hover:border-white/20"
      }
    `}
                  onClick={() => {
                    setSelectedAdviser(adviser);
                    document.body.style.overflow = "hidden";
                  }}
                >
                  <AdviserThumbnail adviser={adviser} />
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
